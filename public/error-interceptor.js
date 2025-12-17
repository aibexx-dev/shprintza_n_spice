/***
 * Browser Error Tracking and Vite HMR Error Detection (ES Module)
 * Captures runtime errors, promise rejections, console errors, and Vite HMR overlay errors
 * Runs as an ES module to support import.meta.hot
 */

// Initialize global error storage - must be attached to window in module context
window.__ERROR_TRACKER__ = window.__ERROR_TRACKER__ || {
  errors: [],
  interactions: [],
  initialized: false,
  readyNotified: false
};

window.__ERROR_TRACKER_READY__ = window.__ERROR_TRACKER_READY__ || false;

const tracker = window.__ERROR_TRACKER__;

const VERSION = '1.1.0';

const STATE = {
  heartbeatId: null,
  consolePatched: false,
  runtimePatched: false,
  networkPatched: false,
  interactionInitialized: false,
  reactHookTimer: null
};

// Configuration
const CONFIG = {
  MAX_INTERACTIONS: 10,
  DEBOUNCE_MS: 150,
  ALLOWED_ORIGINS: ['https://www.aibexx.com', 'https://aibexx.com', 'http://localhost:3000'],
  INTERACTION_TYPES: ['button', 'a', 'input', 'select', 'textarea'],
  HEARTBEAT_MS: 1000,
  SNAPSHOT_LIMIT: 25
};

// Utility: Send message to parent window - attach to window for debugging
function sendToParent(message) {
  if (!window.parent || window.parent === window) return;

  CONFIG.ALLOWED_ORIGINS.forEach(origin => {
    try {
      window.parent.postMessage(message, origin);
    } catch (err) {
      console.warn('Failed to send message:', err);
    }
  });
}

// Attach to window for debugging
window.__sendToParent = sendToParent;

function emitStatus(type, data = {}) {
  const payload = {
    type,
    version: VERSION,
    timestamp: Date.now(),
    ready: !!window.__ERROR_TRACKER_READY__
  };

  if (data && typeof data === 'object') {
    Object.keys(data).forEach(key => {
      payload[key] = data[key];
    });
  }

  sendToParent(payload);
}

function startHeartbeat() {
  if (STATE.heartbeatId) return;
  STATE.heartbeatId = setInterval(() => {
    emitStatus('ERROR_TRACKER_HEARTBEAT', {
      errors: tracker.errors.length,
      interactions: tracker.interactions.length
    });
  }, CONFIG.HEARTBEAT_MS);
}

function stopHeartbeat() {
  if (!STATE.heartbeatId) return;
  clearInterval(STATE.heartbeatId);
  STATE.heartbeatId = null;
}

function sendSnapshot() {
  emitStatus('ERROR_TRACKER_SNAPSHOT', {
    errors: tracker.errors.slice(-CONFIG.SNAPSHOT_LIMIT),
    interactions: tracker.interactions.slice(-CONFIG.MAX_INTERACTIONS)
  });
}

function handleIncomingMessage(event) {
  if (!event || typeof event.data !== 'object') return;

  const origin = event.origin || '';
  if (origin && origin !== 'null' && !CONFIG.ALLOWED_ORIGINS.includes(origin)) return;

  if (event.source && event.source !== window.parent) return;

  const messageType = event.data.type;
  if (!messageType) return;

  if (messageType === 'ERROR_TRACKER_PING') {
    emitStatus('ERROR_TRACKER_PONG', {
      errors: tracker.errors.length,
      interactions: tracker.interactions.length
    });
    if (window.__ERROR_TRACKER_READY__) {
      startHeartbeat();
    }
  } else if (messageType === 'ERROR_TRACKER_SNAPSHOT_REQUEST') {
    sendSnapshot();
  } else if (messageType === 'ERROR_TRACKER_GET_ALL_ERRORS') {
    // Immediate send of all errors (for batch fixing)
    emitStatus('ERRORS_BATCH', {
      errors: tracker.errors,
      totalErrors: tracker.errors.length
    });
  } else if (messageType === 'ERROR_TRACKER_RESET') {
    tracker.errors.length = 0;
    emitStatus('ERROR_TRACKER_RESET_ACK');
  }
}

window.addEventListener('message', handleIncomingMessage);

// Utility: Add interaction to trail
function trackInteraction(interaction) {
  const enriched = {
    ...interaction,
    timestamp: Date.now(),
    url: window.location.href,
    path: window.location.pathname + window.location.search
  };

  tracker.interactions.push(enriched);

  // Keep only recent interactions
  if (tracker.interactions.length > CONFIG.MAX_INTERACTIONS) {
    tracker.interactions.shift();
  }
}

// Utility: Extract user code location from stack trace (skip node_modules and React internals)
function extractUserCodeLocation(stack, filename) {
  if (!stack) return null;
  
  // Try to find first line with user code (src/components or src/)
  const lines = stack.split('\n');
  for (const line of lines) {
    // Match patterns like:
    // at PostCard (https://...dev/src/components/PostCard.tsx:161:31)
    // at PostCard (PostCard.tsx:161:31)
    const match = line.match(/\b(src\/[^:]+\.tsx?):(\d+):(\d+)/);
    if (match) {
      return {
        filename: match[1],
        line: parseInt(match[2], 10),
        column: parseInt(match[3], 10)
      };
    }
  }
  
  // Fallback: use provided filename if it looks like user code
  if (filename && filename.includes('src/')) {
    return { filename, line: null, column: null };
  }
  
  return null;
}

// Utility: Create error object
function createErrorObject(data) {
  // Try to extract user code location from stack
  const userLocation = extractUserCodeLocation(data.stack, data.location?.filename);
  const finalLocation = userLocation || data.location;
  
  return {
    id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    message: data.message || 'Unknown error',
    stack: data.stack || null,
    location: finalLocation,
    source: data.source || 'unknown',
    timestamp: Date.now(),
    url: window.location.href,
    path: window.location.pathname + window.location.search,
    interactions: [...tracker.interactions]
  };
}

// Utility: Filter out non-critical errors (warnings, prop validation, etc.)
function shouldReportError(errorData) {
  const message = errorData.message || '';
  
  // Filter out empty or unknown errors (no useful info)
  if (!message || message === 'Unknown error' || message.trim().length < 5) {
    console.debug('[Error Interceptor] Filtered out empty/unknown error');
    return false;
  }
  
  // CRITICAL: Detect React Context/Hook errors (like "Cannot read properties of null")
  // These indicate serious React internal issues that need immediate attention
  const criticalReactErrors = [
    /Cannot read propert(?:y|ies) of null/i,
    /Cannot read propert(?:y|ies) of undefined.*use(?:State|Effect|Memo|Context)/i,
    /Invalid hook call/i,
    /Rendered (?:more|fewer) hooks than/i,
    /Missing getSnapshotBeforeUpdate/i,
  ];
  
  for (const pattern of criticalReactErrors) {
    if (pattern.test(message)) {
      console.error('[Error Interceptor] CRITICAL React error detected:', message);
      errorData.type = 'react-context-error';
      errorData.critical = true;
      return true; // Always report critical React errors
    }
  }
  
  // Filter out React development warnings (not actual errors)
  const warningPatterns = [
    /Warning:/i,
    /Received.*for a non-boolean attribute/i,
    /Invalid prop/i,
    /Failed prop type/i,
    /Each child in a list should have a unique "key" prop/i,
    /componentWillReceiveProps has been renamed/i,
    /componentWillMount has been renamed/i,
    /%s/,  // React warning placeholders
  ];
  
  for (const pattern of warningPatterns) {
    if (pattern.test(message)) {
      console.debug('[Error Interceptor] Filtered out warning:', message.substring(0, 100));
      return false;
    }
  }
  
  // Filter out source map errors (not user errors)
  if (message.includes('source map') || message.includes('sourcemap')) {
    return false;
  }
  
  return true;
}

// Utility: Store and report error
let batchedErrorTimeout = null;

function reportError(errorData) {
  // Filter out warnings and non-critical errors
  if (!shouldReportError(errorData)) {
    return;
  }
  
  const errorObj = createErrorObject(errorData);
  tracker.errors.push(errorObj);

  // Send individual error immediately for real-time feedback
  emitStatus('RUNTIME_ERROR', {
    error: errorObj
  });
  
  // Also schedule a batched error send after 2 seconds of no new errors
  if (batchedErrorTimeout) {
    clearTimeout(batchedErrorTimeout);
  }
  
  batchedErrorTimeout = setTimeout(() => {
    // Send ALL accumulated errors as a batch
    if (tracker.errors.length > 0) {
      emitStatus('ERRORS_BATCH', {
        errors: tracker.errors.slice(-CONFIG.SNAPSHOT_LIMIT),
        totalErrors: tracker.errors.length
      });
    }
    batchedErrorTimeout = null;
  }, 2000); // Wait 2 seconds for more errors to accumulate
}

// === VITE HMR ERROR DETECTION ===
// Utility: Strip ANSI color codes and control characters
function cleanText(text) {
  if (!text) return '';
  // Remove ANSI escape sequences (color codes, control characters)
  // eslint-disable-next-line no-control-regex
  return text.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '').trim();
}

function extractViteErrorInfo(shadowRoot) {
    try {
      // Extract error details from shadow DOM and clean ANSI codes
      const plugin = cleanText(shadowRoot.querySelector('span.plugin')?.textContent || '');
      const messageBody = cleanText(shadowRoot.querySelector('.message-body')?.textContent || '');
      const fileText = cleanText(shadowRoot.querySelector('.file')?.textContent || '');
      const frame = cleanText(shadowRoot.querySelector('.frame')?.textContent || '');
      const stack = cleanText(shadowRoot.querySelector('.stack')?.textContent || '');

      // Fallback extraction methods
      const messageElem = shadowRoot.querySelector('.message');
      const windowElem = shadowRoot.querySelector('.window');
      const messageText = cleanText(messageElem?.textContent || '');
      const windowText = cleanText(windowElem?.textContent || '');
      const errorText = messageBody || messageText || windowText || 'Vite build error detected';

      // Extract file location - clean the filename to remove any ANSI artifacts
      let location = null;
      const patterns = [
        fileText.match(/(.*?):(\d+):(\d+)/),
        frame.match(/(\S+\.[tj]sx?):(\d+):(\d+)/),
        errorText.match(/([^:\s]+\.[tj]sx?):(\d+):(\d+)/)
      ];

      for (const match of patterns) {
        if (match) {
          // Clean the filename to remove any remaining ANSI artifacts or control characters
          const rawFilename = match[1];
          // eslint-disable-next-line no-control-regex
          const cleanFilename = rawFilename.replace(/[\x00-\x1F\x7F-\x9F]/g, '').replace(/^[^a-zA-Z0-9/_.@-]+/, '');
          
          location = {
            filename: cleanFilename,
            line: parseInt(match[2], 10),
            column: parseInt(match[3], 10)
          };
          break;
        }
      }

      // Build comprehensive message
      let fullMessage = plugin ? `[${plugin}] ` : '';
      fullMessage += errorText;

      if (frame && !fullMessage.includes(frame)) {
        fullMessage += `\n\n${frame}`;
      }

      if (fileText && !fullMessage.includes(fileText)) {
        fullMessage += `\n\nFile: ${fileText}`;
      }

      return {
        message: fullMessage || 'Vite error (no details)',
        stack: stack || '',
        location,
        source: 'vite-hmr'
      };
    } catch (err) {
      // Fallback: extract any text content
      const anyText = shadowRoot.textContent?.trim() || 'Unknown Vite error';
      return {
        message: `Vite error: ${anyText.substring(0, 500)}`,
        source: 'vite-hmr'
      };
    }
  }

function checkViteErrorOverlay() {
    const overlay = document.querySelector('vite-error-overlay');
    if (!overlay) return;

    if (!overlay.shadowRoot) {
      requestAnimationFrame(checkViteErrorOverlay);
      return;
    }

    const errorInfo = extractViteErrorInfo(overlay.shadowRoot);
    reportError(errorInfo);
  }

function setupViteErrorDetection() {
    // Watch for error overlay additions
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
          const hasOverlay = Array.from(mutation.addedNodes).some(
            node => node.nodeName?.toLowerCase() === 'vite-error-overlay'
          );

          if (hasOverlay) {
            requestAnimationFrame(checkViteErrorOverlay);
          }
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Listen for Vite HMR events
    if (import.meta?.hot) {
      import.meta.hot.on('vite:error', () => {
        requestAnimationFrame(checkViteErrorOverlay);
      });
    }

    // Check for existing overlay
    if (document.querySelector('vite-error-overlay')) {
      requestAnimationFrame(checkViteErrorOverlay);
    }
  }

  function setupReactErrorOverlayHooks() {
      if (STATE.reactHookTimer) return;

      const hookName = '__REACT_ERROR_OVERLAY_GLOBAL_HOOK__';

      function normalizeLocation(info) {
        if (!info) return null;

        const filename = info.file || info.filename || info.moduleId || null;
        const line = info.line || info.lineNumber || info.lineno || null;
        const column = info.column || info.columnNumber || info.colno || null;

        if (!filename && !line && !column) {
          return null;
        }

        return {
          filename: filename || null,
          line: typeof line === 'number' ? line : (typeof line === 'string' ? parseInt(line, 10) || undefined : undefined),
          column: typeof column === 'number' ? column : (typeof column === 'string' ? parseInt(column, 10) || undefined : undefined)
        };
      }

      function reportOverlayError(source, payload) {
        if (!payload) return;

        const message = payload.message || payload.error?.message || 'React overlay error';
        const stack = payload.stack || payload.error?.stack || '';
        const loc = normalizeLocation(payload.loc || payload.location || payload);

        reportError({
          message,
          stack,
          location: loc,
          source
        });
      }

      function attachToHook(hook) {
        if (!hook || hook.__errorTrackerPatched) return;
        hook.__errorTrackerPatched = true;

        const wrap = (key, source) => {
          if (typeof hook[key] !== 'function') return;
          const original = hook[key].bind(hook);
          hook[key] = (error) => {
            try {
              reportOverlayError(source, error);
            } catch (overlayError) {
              console.warn('[Error Interceptor] Failed to capture React overlay error', overlayError);
            }

            return original(error);
          };
        };

        wrap('onBuildError', 'react-build-error');
        wrap('onRuntimeError', 'react-runtime-error');
      }

      function checkForHook() {
        const hook = window[hookName];
        if (hook) {
          attachToHook(hook);
          if (STATE.reactHookTimer) {
            clearInterval(STATE.reactHookTimer);
            STATE.reactHookTimer = null;
          }
        }
      }

      checkForHook();
      if (!STATE.reactHookTimer) {
        STATE.reactHookTimer = setInterval(checkForHook, 1000);
      }
  }

// === RUNTIME ERROR DETECTION ===
function setupRuntimeErrorDetection() {
    const seenErrors = new Set();
    const errorKey = (msg, file, line, col) => `${msg}|${file}|${line}|${col}`;
      if (STATE.runtimePatched) return;
      STATE.runtimePatched = true;

    // Deduplicate errors
    function isDuplicate(key) {
      if (seenErrors.has(key)) return true;
      seenErrors.add(key);
      setTimeout(() => seenErrors.delete(key), 5000);
      return false;
    }

    // Global error handler - catches both runtime and module syntax errors
    window.addEventListener('error', (event) => {
      // Check if this is a resource loading error (script/module failed to load)
      if (event.target && (event.target.tagName === 'SCRIPT' || event.target.tagName === 'LINK')) {
        const resourceUrl = event.target.src || event.target.href;
        const fileName = resourceUrl ? resourceUrl.split('/').pop() : 'unknown';
        
        // Ignore main.tsx load errors - they're usually caused by dependencies
        // (like ErrorBoundary) having errors, not main.tsx itself
        if (fileName === 'main.tsx') {
          console.warn('[Error Interceptor] Ignoring main.tsx load error (usually caused by dependency errors)');
          return;
        }
        
        console.error('[Error Interceptor] Module load failed (HTTP error):', {
          url: resourceUrl,
          file: fileName,
          type: 'module-load-error'
        });

        reportError({
          message: `Failed to load module: ${fileName} (likely syntax error or 500 error from Vite)`,
          location: {
            filename: fileName,
            line: 1,
            column: 1
          },
          stack: `Module load error: ${resourceUrl}`,
          source: 'module-load-failure'
        });
        
        return;
      }

      const key = errorKey(event.message, event.filename, event.lineno, event.colno);
      if (isDuplicate(key)) return;

      // Detect module syntax errors (e.g., "Identifier 'X' has already been declared")
      const message = event.message || '';
      const isSyntaxError = message.includes('SyntaxError') || 
                           message.includes('has already been declared') ||
                           message.includes('Unexpected token') ||
                           message.includes('Unexpected identifier');

      reportError({
        message: message || 'Unknown error',
        location: {
          filename: event.filename,
          line: event.lineno,
          column: event.colno
        },
        stack: event.error?.stack,
        source: isSyntaxError ? 'module-syntax' : 'runtime'
      });

      // Don't log syntax errors separately - they're already logged by the browser
      // and will be reported via reportError above
    }, true); // Use capture phase to catch resource load errors

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      const key = event.reason?.stack || event.reason?.message || String(event.reason);
      if (isDuplicate(key)) return;

      reportError({
        message: event.reason?.message || String(event.reason) || 'Unhandled promise rejection',
        stack: event.reason?.stack || String(event.reason),
        source: 'promise'
      });
    });
  }

// === CONSOLE ERROR INTERCEPTION ===
function setupConsoleInterception() {
  if (STATE.consolePatched) return;
  STATE.consolePatched = true;

    const original = {
      log: console.log,
      warn: console.warn,
      error: console.error
    };

    const levels = {
      log: 'info',
      warn: 'warning',
      error: 'error'
    };

    ['log', 'warn', 'error'].forEach(level => {
      console[level] = (...args) => {
        // Call original console method
        original[level].apply(console, args);

        // Capture stack trace for warnings and errors
        let stack = null;
        if (level === 'warn' || level === 'error') {
          const err = new Error();
          if (err.stack) {
            stack = err.stack.split('\n').slice(2).join('\n');
          }
        }

        // Format message
        const message = args.map(arg => {
          if (typeof arg === 'string') return arg;
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }).join(' ');

        // Store console errors (but filter out React warnings first)
        if (level === 'error') {
          // Skip React warnings that come through console.error
          if (message.includes('Warning:') || 
              message.includes('%s') || // React warning placeholder
              message.includes('non-boolean attribute')) {
            console.debug('[Error Interceptor] Filtered React warning from console.error');
            // Don't call reportError for warnings, but continue to send CONSOLE_OUTPUT below
          } else {
            // Only report actual errors
            reportError({
              message: message + (stack ? '\n' + stack : ''),
              stack,
              source: 'console'
            });
          }
        }

        // Send to parent
        emitStatus('CONSOLE_OUTPUT', {
          level: levels[level],
          message: message + (stack ? '\n' + stack : ''),
          timestamp: new Date().toISOString(),
          interactions: [...tracker.interactions]
        });
      };
    });
  }

// === NETWORK REQUEST MONITORING ===
function setupNetworkMonitoring() {
  if (STATE.networkPatched) return;
  STATE.networkPatched = true;

    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
      const startTime = Date.now();

      try {
        // Serialize request body
        let requestBody = null;
        if (args[1]?.body) {
          try {
            if (typeof args[1].body === 'string') {
              requestBody = args[1].body;
            } else if (args[1].body instanceof FormData) {
              requestBody = 'FormData: ' + Array.from(args[1].body.entries())
                .map(([k, v]) => `${k}=${v}`).join('&');
            } else if (args[1].body instanceof URLSearchParams) {
              requestBody = args[1].body.toString();
            } else {
              requestBody = JSON.stringify(args[1].body);
            }
          } catch {
            requestBody = 'Could not serialize request body';
          }
        }

        const response = await originalFetch(...args);

        // Send success info
        emitStatus('NETWORK_REQUEST', {
          request: {
            url: args[0] || response.url,
            method: args[1]?.method || 'GET',
            status: response.status,
            statusText: response.statusText,
            responseBody: response.clone ? await response.clone().text() : undefined,
            requestBody,
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            headers: args[1]?.headers ? Object.fromEntries(new Headers(args[1].headers)) : {},
            interactions: [...tracker.interactions]
          }
        });

        return response;
      } catch (error) {
        // Send error info
        emitStatus('NETWORK_REQUEST', {
          request: {
            url: args[0],
            method: args[1]?.method || 'GET',
            timestamp: new Date().toISOString(),
            duration: Date.now() - startTime,
            error: {
              message: error?.message || 'Unknown fetch error',
              stack: error?.stack
            },
            interactions: [...tracker.interactions]
          }
        });

        throw error;
      }
    };
  }

// === USER INTERACTION TRACKING ===
function setupInteractionTracking() {
  if (STATE.interactionInitialized) return;
  STATE.interactionInitialized = true;

    let lastInteraction = 0;

    // Track page load
    trackInteraction({
      type: 'page_load',
      element: 'page',
      details: { title: document.title }
    });

    // Track clicks
    document.addEventListener('click', (event) => {
      const now = Date.now();
      if (now - lastInteraction < CONFIG.DEBOUNCE_MS) return;
      lastInteraction = now;

      const target = event.target;
      const tagName = target.tagName?.toLowerCase();

      if (CONFIG.INTERACTION_TYPES.includes(tagName)) {
        trackInteraction({
          type: 'click',
          element: tagName,
          text: target.textContent?.trim().substring(0, 50) || target.value || tagName
        });
      }
    }, true);

    // Track navigation
    let currentPath = window.location.pathname + window.location.search;
    window.addEventListener('popstate', () => {
      const newPath = window.location.pathname + window.location.search;
      if (newPath !== currentPath) {
        trackInteraction({
          type: 'navigation',
          from: currentPath,
          to: newPath
        });
        currentPath = newPath;
      }
    });
}

// === INITIALIZATION ===
function initialize() {
    if (tracker.initialized) return;
    tracker.initialized = true;

    // Only run inside iframe (development environment)
    if (window.top !== window.self) {
      setupViteErrorDetection();
      setupRuntimeErrorDetection();
      setupConsoleInterception();
      setupNetworkMonitoring();
      setupInteractionTracking();
      setupReactErrorOverlayHooks();

      // Notify parent that tracker is fully ready
      window.__ERROR_TRACKER_READY__ = true;
      emitStatus('ERROR_TRACKER_READY', {
        reason: 'dom-initialized'
      });
      startHeartbeat();
    } else {
      emitStatus('ERROR_TRACKER_SKIPPED', {
        reason: 'not-in-iframe'
      });
    }
}

if (window.top !== window.self) {
  setupRuntimeErrorDetection();
  setupConsoleInterception();
  setupNetworkMonitoring();
  setupReactErrorOverlayHooks();

  emitStatus('ERROR_TRACKER_BOOTSTRAPPED', {
    reason: 'runtime-hooks-attached'
  });
}

window.addEventListener('beforeunload', () => {
  stopHeartbeat();
  if (STATE.reactHookTimer) {
    clearInterval(STATE.reactHookTimer);
    STATE.reactHookTimer = null;
  }
});

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

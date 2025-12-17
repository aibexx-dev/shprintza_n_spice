const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  	extend: {
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    
    // Auto-fix plugin for malformed theme variable classes
    // Prevents build errors when AI generates incorrect syntax
    plugin(function({ addUtilities }) {
      // Map malformed classes to correct CSS variables
      // This catches edge cases that slip through validation
      const malformedClassFixes = {
        '.border-border': { 'border-color': 'var(--border)' },
        '.bg-primary': { 'background-color': 'var(--primary)' },
        '.text-primary': { 'color': 'var(--primary)' },
        '.bg-secondary': { 'background-color': 'var(--secondary)' },
        '.text-secondary': { 'color': 'var(--secondary)' },
        '.bg-accent': { 'background-color': 'var(--accent)' },
        '.text-accent': { 'color': 'var(--accent)' },
        '.bg-foreground': { 'background-color': 'var(--foreground)' },
        '.text-foreground': { 'color': 'var(--foreground)' },
        '.bg-background': { 'background-color': 'var(--background)' },
        '.text-background': { 'color': 'var(--background)' },
        '.bg-muted': { 'background-color': 'var(--muted)' },
        '.text-muted': { 'color': 'var(--muted)' },
        '.border-primary': { 'border-color': 'var(--primary)' },
        '.border-muted': { 'border-color': 'var(--border)' },
        '.border-secondary': { 'border-color': 'var(--secondary)' },
        '.border-accent': { 'border-color': 'var(--accent)' },
      }
      
      addUtilities(malformedClassFixes)
    })
  ],
}

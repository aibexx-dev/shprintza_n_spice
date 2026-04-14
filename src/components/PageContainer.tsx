import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Volume2, Square, Play, Pause } from 'lucide-react';



const baseUrlEnglish = "https://pub-e636047e1907470b8188b143fe791978.r2.dev/";
const baseUrlSpanish = "https://pub-25dfe36dd1e8461d84b7c047833238e5.r2.dev/";

const SpanishFiles = {
  intro: 'Cover%20page%20spanish.m4a.mp3', //ok
  dedication: '', // no audio for dedication page in Spanish
  page3: 'page%203%20spanish.mp3', //ok
  page4: 'page%204%20spanish.mp3',
  page5: 'page%205%20spanish.m4a.mp3', //ok
  page6: 'page%206%20spanish.m4a.mp3', // ok
  page7: '', // no audio for page 7 in Spanish right now checking with the client 
  page8: 'page%208%20spanish.m4a.mp3',// ok
  page9: 'page%209%20spanish.m4a.mp3', //ok
  page10: 'page%2012%20spanish.m4a.mp3',// ok
  page11: 'page%2011%20spanish.m4a.mp3', //ok
  page12: 'page%2012%20spanish.m4a.mp3', //ok
  page13: 'page%2013%20spanish.m4a.mp3',// ok
  quizQ1: 'Quiz%20Q1%20spanish.m4a.mp3', //ok
  quizQ2: 'Quiz%20Q2%20spanish.m4a.mp3', //ok
  quizQ3: 'Quiz%20Q3%20spanish.m4a.mp3', //ok
  quizQ4: 'Quiz%20Q4%20spanish.m4a.mp3', //ok
};


const EnglishFiles = {
  intro: 'Cover%20Page.mp3', //ok
  dedication: '', // no audio for dedication page in English
  page3: 'Page%203.m4a.mp3', //ok
  page4: 'Page%204.m4a.mp3', //ok
  page5: 'Page%205.m4a.mp3', //ok
  page6: 'Page%206.m4a.mp3', //ok
  page7: 'Page%207.m4a.mp3', //ok
  page8: 'Page%208.m4a.mp3', //ok
  page9: 'Page%209.m4a.mp3', //ok
  page10: 'Page%2010%20.mp3', //ok
  page11: 'Page%2011.m4a.mp3', //ok
  page12: 'Page%2012.m4a.mp3', //ok
  page13: 'Page%2013.mp3', //ok
  quizQ1: 'Quiz%20Q1%20.m4a.mp3', //ok
  quizQ2: 'Quiz%20Q2.m4a.mp3', //ok
  quizQ3: 'Quiz%20Q3.m4a.mp3', //ok
  quizQ4: 'Quiz%20Q4.m4a.mp3'
};


interface Question {
  question: string;
  answers: string[];
  correctAnswer: string;
  imageUrl?: string;
}

interface Page {
  page_type: 'cover' | 'dedication' | 'story' | 'quiz' | 'back_cover' | 'interactive_quiz';
  text_top: string;
  images: string[];
  text_bottom: string;
  quiz_question: string;
  quiz_answers: string[];
  questions?: Question[];
}

const PageContainer: React.FC = () => {
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(false);
  const [currentQuizImage, setCurrentQuizImage] = useState<string>('');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeUpdateRef = useRef<((e: Event) => void) | null>(null);
  const currentPageIndexRef = useRef(currentPageIndex);
  const isAutoPlayRef = useRef(isAutoPlay);
  const quizQuestionIndexRef = useRef(quizQuestionIndex);
  const isInitialRenderRef = useRef(true);

  // Create audio element on mount
  useEffect(() => {
    const audio = new Audio();
    audio.volume = 1.0;
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Keep refs in sync with state
  useEffect(() => {
    currentPageIndexRef.current = currentPageIndex;
  }, [currentPageIndex]);

  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  useEffect(() => {
    quizQuestionIndexRef.current = quizQuestionIndex;
  }, [quizQuestionIndex]);

  // Toggle this to switch between layouts: true = vertical (text-image-text), false = side-by-side (image | text)
  const useVerticalLayout = false;

  const t = {
    en: {
      previous: 'Previous',
      prev: 'Prev',
      next: 'Next',
      auto: 'Auto',
      stop: 'Stop',
      listen: 'Listen',
      listenToSong: 'Listen to Song',
      quizCompleted: '🎉 Great job! You completed the quiz! 🎉',
      meaning: 'Meaning:',
    },
    es: {
      previous: 'Anterior',
      prev: 'Ant',
      next: 'Siguiente',
      auto: 'Auto',
      stop: 'Detener',
      listen: 'Escuchar',
      listenToSong: 'Escuchar Canción',
      quizCompleted: '🎉 ¡Buen trabajo! ¡Completaste el cuestionario! 🎉',
      meaning: 'Significado:',
    }
  }[language];

  const pages: Page[] = language === 'en' ? [
    {
      page_type: 'cover',
      text_top: 'Shira n\' Spice: The "Modeh Ani" Song\n\nA Jewish bedtime story of gratitude and prayer for little souls\n\nBy: Rabbi Yossi Srugo - Miami Mohel',
      images: ['/images/front-cover.jpg'],
      text_bottom: 'Join patient Shira, silly Shai and spectacular Spice-the KooKoo chicken, as they discover that the greatest gift we receive, it\'s the gift of life itself, given to us by God- Hashem, fresh every single morning!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'dedication',
      text_top: 'Dedicated to the thousands of precious souls I\'ve had the privilege to perform their Brit Milah— at the holy instant when heaven touches earth, and a new Neshama, soul, shines into this world.\nMay I merit that all those Neshamas shine always, as the stars shine in the heavens.\n— Rabbi Yossi Srugo- Miami Mohel',
      images: ['/images/rabbi.jpg'],
      text_bottom: 'Special thanks to the amazing Collins family -Michael, Tiferet and their 2 cute boys Chaim Mordechai and Baby Adam Yehuda, whom I\'ve had the privilege and honor to do their Bris.\nThank you! Because of you, thousands of children will learn to pray to G-d and be thankful!\nMay this publication bring Hashem\'s blessing to you, spiritually, physically and in great abundance!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page1-1.jpg', '/images/page1-2.jpg', '/images/page1-3.jpg'],
      text_bottom: 'Shai opened his eyes and sighed a big, sleepy sigh.\nShai: "Ugh… I\'m soooo sad. I don\'t have a new toy today."\nSuddenly, Shira appeared beside him, her face glowing with warmth.\nShira: "Good morning, Shai! You know, the best gift isn\'t a new toy."\nShai: "It\'s not? But toys are the BEST!"\nSpice flapped dramatically onto the pillow.\nSpice: "Koo-koo-ree-koo! Boker Tov, yeladim! The biggest gift is… a BAG FULL OF YUMMY WORMS!"\nShai: "EWWWW! Spice, that\'s gross!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page2-1.jpg', '/images/page2-2.jpg'],
      text_bottom: 'Shira: "Shai, every single morning Hashem gives us the most amazing present of all."\nShai: "Better than a LEGO spaceship with two astronauts AND a laser cannon?"\nSpice: "Better than a mountain of cornflakes with extra seeds on top?"\nShira: (smiling patiently) "Even better! Hashem gives you back your Neshama — your soul!"\nShai: "My Nesh-a-ma? What\'s that? Can I play with it?"\nShira: "Your Neshama is the spark of Hashem inside you — it\'s what makes you alive! It helps you think, feel, love, and be kind."\nShai: "Ohhh! Is THAT why I can think of silly jokes?"\nSpice: "Or FLYYYY?!" (flaps wildly and bumps into the lamp)\nShira: (laughing softly) "Exactly, Shai."',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page3-1.jpg'],
      text_bottom: 'Shira: "When we sleep, our Neshama rests with Hashem. It goes up to Heaven! And when we wake up… Hashem sends it right back to us."\nShai: "Whoa! So my Neshama goes on a trip every night?"\nShira: "Yes! That\'s why we say Modeh Ani the very first thing when we wake up — even before we get out of bed, even before we wash our hands — to thank Hashem for giving us life again."\nSpice: "I\'m thankful for my magnificent feathers!" (poses like a supermodel)\nShai: "So I get my soul back every single morning? Even on Mondays?!"\nShira: "Every beautiful day, Shai. Every single one."\nSpice: "And I get… BREAKFAST! Koo-koo-ree-koo!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page4-1.jpg'],
      text_bottom: 'Shira: "Let\'s celebrate being alive!"\nThey begin to sing and dance around the room:\nShira & Shai: "I\'m alive! I\'m alive! Hashem gave me my soul inside!"\nSpice: (spinning in circles) "I\'m aliiiive! Koo-koo-ree-koo! ¡Estoy vivo! Ani chai! Koo-koo-ree-koo!"\nShai: (jumping on the bed) "This is better than toys!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page5-1.jpg'],
      text_bottom: 'Shai: "Shira, did everyone always say Modeh Ani when they woke up?"\nShira: (sitting down beside him) "That\'s a wonderful question! Let me tell you about King David. Long, long ago, King David kept a beautiful harp beside his bed."\nShai: "A harp? In his BEDROOM?"\nShira: "Yes! Every morning at midnight, a gentle breeze from the North would blow through his window and make the harp sing — ting-tong-ting!"\nSpice: (strumming air guitar) "Like a rockstar! Koo-koo-ree-koo!"\nShira: "King David would wake up and immediately sing thanks to Hashem for his life — for his red hair, his eyes, his ability to play music… even his toes!"\nShai: (wiggling his toes) "Even toes? That\'s silly!"\nShira: "King David knew that every part of him was a gift. That\'s what Modeh Ani teaches us — to be grateful for everything, big and small."',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page6-1.jpg', '/images/page6-2.jpg', '/images/page6-3.jpg'],
      text_bottom: 'The next morning, Shai woke up looking for his favorite toy car.\nShai: "Where is it? Where\'s my red race car? I NEED IT!"\nHe looked under the bed. Not there. He looked in his toy box. Not there either!\nShai:  Oy vey! "This is the WORST day ever”!\nSpice: (landing on his shoulder) "Shai! Shai! Remember what we learned?"\nShai: "But Spice… I really wanted to play with it!"\nShira: (kneeling down gently) "I know you\'re disappointed, Shai. But let\'s think — what gift do you have right now, even without your toy car?"\nShai paused. He touched his chest where his Neshama was.\nShai: (taking a deep breath) "My Neshama! Modeh Ani... thank You, Hashem, for giving me back my soul. Thank You for my eyes to look for toys, my hands to play, my family who loves me, and... and even for Spice, even when he\'s being silly!"\nSpice: "I\'m not silly — I\'m Koo-koo-ree-koo!"\nJust then, Shai’s little sister walked in, pushing the red race car.\nShai: "There it is! She had it the whole time!"\nShira: (smiling warmly) "See? When we start with gratitude, everything feels better."',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'interactive_quiz',
      text_top: '',
      images: ['/images/page7-1.jpg'],
      text_bottom: 'Shira: "Every morning, start with gratitude." \nShai: "Even before slippers!"\nSpice: "Especially before breakfast! Koo-koo-ree-koo!"',
      quiz_question: '',
      quiz_answers: [],
      questions: [
        {
          question: 'Why do we say Modeh Ani first thing when we wake up, even before getting out of bed?',
          answers: ['To get rid of bad breath?', 'To thank Hashem for our soul, our life, right away, before doing anything else!', 'So we can skip school?', 'To forget a bad dream?'],
          correctAnswer: 'To thank Hashem for our soul, our life, right away, before doing anything else!',
          imageUrl: '/images/page7-1.jpg'
        },
        {
          question: ' What is a Neshama?',
          answers: [' A flying car that goes to the moon?', 'Our soul, a spark of Hashem that helps us think, feel, love, and be kind.', 'A submarine that looks like a whale?', 'A monkey that plays the trumpet?'],
          correctAnswer: 'Our soul, a spark of Hashem that helps us think, feel, love, and be kind.',
          imageUrl: '/images/page7-3.jpg'
        },
        {
          question: 'Where does our Neshama go when we sleep?',
          answers: ['It goes shopping for toys?', 'It visits the zoo?', 'It rests with Hashem in Heaven and returns when we wake up!', 'It stays in our shoes?'],
          correctAnswer: 'It rests with Hashem in Heaven and returns when we wake up!',
          imageUrl: '/images/page7-4.jpg'
        },
        {
          question: 'Why don\'t we say Hashem\'s name in Modeh Ani?',
          answers: ['Because we forgot it?', 'Because it\'s too early?', 'Because Spice is too loud?', 'Because we haven\'t washed our hands yet! We say "Melech chai v\'kayam" (Living and Eternal King) instead.'],
          correctAnswer: 'Because we haven\'t washed our hands yet! We say "Melech chai v\'kayam" (Living and Eternal King) instead.',
          imageUrl: '/images/page7-5.jpg'
        }
      ]
    },
    {
      page_type: 'story',
      text_top: '🌟 Modeh Ani 🌟',
      images: ['/images/page8-1.jpg'],
      text_bottom: 'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ\n\nModeh Ani lefanecha, Melech chai v\'kayam, Shehechezarta bi nishmati bechemlah, Rabba emunatecha.\n\nMeaning: Thank You, Hashem, for returning my soul to me with kindness. How great is Your faithfulness!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Giggle Page',
      images: ['/images/giggle-page.jpg'],
      text_bottom: 'Shai: "Shira… does my soul come wrapped like a Chanukah present with a bow?"\nSpice: "Of course! In bubble wrap — pop! pop! pop! Amen!"\nShira: (giggling) "Modeh Ani means \'I thank You.\'"\nSpice: "Ohhh… I thought it meant \'More Deli, honey!\'"\nShai: "Or \'More Silly Money!\'"\nSpice: "Or \'Moody Bunny!\'"\nEveryone bursts out laughing and tumbles onto the pillows.\nShira: (still giggling) "You two are impossible!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '🌟 Spice\'s Song 🌟',
      images: ['/images/song-page.jpg'],
      text_bottom: 'Spice: (clearing his throat dramatically, standing on the bedpost) TTTO You’re my sunshine\n"Every morning when I\'m still sleeping, I open up my eyes and say, Thank You, Hashem, for my Neshama, And for giving me another day!"\nThen VERY loudly and proudly: continue w Same tune\n"Modeh Ani Lefanecha, Melech chai v\'kayam, Shehechezarta bi nishmati bechemlah, Rabba emunatecha!"\nShira: (clapping) "Beautiful, Spice! You remembered every word!"\nShai: "You sound even better than a real rooster!"\nSpice: (puffing up his chest) "I\'m not just any chicken — I\'m a THANKFUL chicken! A GRATEFUL chicken! A—"\nShai & Shira: "We know, Spice!"\nSpice: "KOO-KOO-REE-KOOOOO!!!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'back_cover',
      text_top: 'The End',
      images: ['/images/back-cover.jpg'],
      text_bottom: 'A joyful bedtime and morning story that teaches gratitude, laughter, and one of the most important prayers every Jewish child learns — Modeh Ani.',
      quiz_question: '',
      quiz_answers: []
    }
  ] : [
    {
      page_type: 'cover',
      text_top: 'Shira y Spice: La canción "Modeh Ani"\n\nUn cuento judío de gratitud y oración para pequeñas almas antes de dormir\n\nPor: Rabino Yossi Srugo - Miami Mohel',
      images: ['/images/front-cover.jpg'],
      text_bottom: 'Únete a la paciente Shira, al ocurrente Shai y al espectacular Spice, el pollo loquito, mientras descubren que el mayor regalo que recibimos es el don de la vida misma, ¡dado por Dios - Hashem, nuevo cada mañana!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'dedication',
      text_top: 'Dedicado a las miles de almas preciosas a las que he tenido el privilegio de realizar su Brit Milá — en el instante sagrado en que el cielo toca la tierra, y una nueva Neshama, alma, brilla en este mundo.\nQue tenga el mérito de que todas esas Neshamas brillen siempre, como las estrellas en los cielos.\n— Rabino Yossi Srugo - Miami Mohel',
      images: ['/images/rabbi.jpg'],
      text_bottom: 'Un agradecimiento especial a la increíble familia Collins: Michael, Tiferet y sus 2 lindos hijos Chaim Mordechai y el bebé Adam Yehuda, a quienes he tenido el privilegio y el honor de hacer su Bris.\n¡Gracias! ¡Gracias a ustedes, miles de niños aprenderán a orar a Di-s y a ser agradecidos!\n¡Que esta publicación les traiga la bendición de Hashem, espiritual, física y en gran abundancia!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page1-1.jpg', '/images/page1-2.jpg', '/images/page1-3.jpg'],
      text_bottom: 'Shai abrió los ojos y suspiró con un gran suspiro de sueño.\nShai: "Uf... estoy taaaan triste. Hoy no tengo un juguete nuevo".\nDe repente, Shira apareció a su lado, su rostro brillando con calidez.\nShira: "¡Buenos días, Shai! Sabes, el mejor regalo no es un juguete nuevo".\nShai: "¿No lo es? ¡Pero los juguetes son lo MEJOR!"\nSpice aleteó dramáticamente sobre la almohada.\nSpice: "¡Koo-koo-ree-koo! ¡Boker Tov, yeladim! El regalo más grande es... ¡UNA BOLSA LLENA DE DELICIOSOS GUSANOS!"\nShai: "¡EWWWW! Spice, ¡eso es asqueroso!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page2-1.jpg', '/images/page2-2.jpg'],
      text_bottom: 'Shira: "Shai, cada mañana Hashem nos da el regalo más increíble de todos".\nShai: "¿Mejor que una nave espacial de LEGO con dos astronautas Y un cañón láser?"\nSpice: "¿Mejor que una montaña de hojuelas de maíz con semillas extra encima?"\nShira: (sonriendo pacientemente) "¡Aún mejor! Hashem te devuelve tu Neshama, ¡tu alma!"\nShai: "¿Mi Nesh-a-ma? ¿Qué es eso? ¿Puedo jugar con ella?"\nShira: "Tu Neshama es la chispa de Hashem dentro de ti, ¡es lo que te hace estar vivo! Te ayuda a pensar, sentir, amar y ser amable".\nShai: "¡Ohhh! ¿Es por ESO que puedo pensar en chistes tontos?"\nSpice: "¡¿O VOLAAAR?!" (aletea salvajemente y choca contra la lámpara)\nShira: (riendo suavemente) "Exactamente, Shai".',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page3-1.jpg'],
      text_bottom: 'Shira: "Cuando dormimos, nuestra Neshama descansa con Hashem. ¡Sube al Cielo! Y cuando nos despertamos... Hashem nos la envía de vuelta".\nShai: "¡Guau! ¿Así que mi Neshama se va de viaje todas las noches?"\nShira: "¡Sí! Por eso decimos Modeh Ani lo primero al despertar, incluso antes de salir de la cama, incluso antes de lavarnos las manos, para agradecer a Hashem por darnos vida de nuevo".\nSpice: "¡Estoy agradecido por mis magníficas plumas!" (posa como un supermodelo)\nShai: "¿Así que recupero mi alma cada mañana? ¡¿Incluso los lunes?!"\nShira: "Cada hermoso día, Shai. Todos y cada uno de ellos".\nSpice: "Y yo tengo... ¡DESAYUNO! ¡Koo-koo-ree-koo!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page4-1.jpg'],
      text_bottom: 'Shira: "¡Celebremos estar vivos!"\nEmpiezan a cantar y bailar por la habitación:\nShira y Shai: "¡Estoy vivo! ¡Estoy vivo! ¡Hashem me dio mi alma por dentro!"\nSpice: (girando en círculos) "¡Estoy viiiivo! ¡Koo-koo-ree-koo! ¡Estoy vivo! ¡Ani chai! ¡Koo-koo-ree-koo!"\nShai: (saltando en la cama) "¡Esto es mejor que los juguetes!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page5-1.jpg'],
      text_bottom: 'Shai: "Shira, ¿todos decían siempre Modeh Ani al despertar?"\nShira: (sentándose a su lado) "¡Esa es una maravillosa pregunta! Déjame contarte sobre el Rey David. Hace mucho, mucho tiempo, el Rey David tenía un hermoso arpa junto a su cama".\nShai: "¿Un arpa? ¿En su DORMITORIO?"\nShira: "¡Sí! Cada mañana a la medianoche, una suave brisa del norte soplaba por su ventana y hacía cantar al arpa — ¡ting-tong-ting!"\nSpice: (tocando una guitarra de aire) "¡Como una estrella de rock! ¡Koo-koo-ree-koo!"\nShira: "El Rey David se despertaba e inmediatamente cantaba gracias a Hashem por su vida: por su cabello rojo, sus ojos, su habilidad para tocar música... ¡incluso por los dedos de sus pies!"\nShai: (moviendo los dedos de los pies) "¿Incluso los dedos de los pies? ¡Eso es una tontería!"\nShira: "El Rey David sabía que cada parte de él era un regalo. Eso es lo que nos enseña Modeh Ani: a ser agradecidos por todo, grande y pequeño".',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '',
      images: ['/images/page6-1.jpg', '/images/page6-2.jpg', '/images/page6-3.jpg'],
      text_bottom: 'A la mañana siguiente, Shai se despertó buscando su coche de carreras de juguete favorito.\nShai: "¿Dónde está? ¿Dónde está mi coche de carreras rojo? ¡LO NECESITO!"\nBuscó debajo de la cama. No estaba allí. Miró en su caja de juguetes. ¡Tampoco estaba allí!\nShai: ¡Oy vey! "¡Este es el PEOR día de mi vida!"\nSpice: (aterrizando en su hombro) "¡Shai! ¡Shai! ¿Recuerdas lo que aprendimos?"\nShai: "Pero Spice... ¡realmente quería jugar con él!"\nShira: (arrodillándose suavemente) "Sé que estás decepcionado, Shai. Pero pensemos: ¿qué regalo tienes ahora mismo, incluso sin tu coche de juguete?"\nShai hizo una pausa. Se tocó el pecho donde estaba su Neshama.\nShai: (tomando una respiración profunda) "¡Mi Neshama! Modeh Ani... gracias, Hashem, por devolverme mi alma. Gracias por mis ojos para buscar juguetes, mis manos para jugar, mi familia que me ama y... e incluso por Spice, ¡incluso cuando está siendo tonto!"\nSpice: "No soy tonto — ¡soy Koo-koo-ree-koo!"\nJusto en ese momento, la hermana pequeña de Shai entró empujando el coche de carreras rojo.\nShai: "¡Ahí está! ¡Ella lo tuvo todo el tiempo!"\nShira: (sonriendo cálidamente) "¿Ves? Cuando empezamos con gratitud, todo se siente mejor".',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'interactive_quiz',
      text_top: '',
      images: ['/images/page7-1.jpg'],
      text_bottom: 'Shira: "Cada mañana, empieza con gratitud."\nShai: "¡Incluso antes que las pantuflas!"\nSpice: "¡Especialmente antes del desayuno! ¡Koo-koo-ree-koo!"',
      quiz_question: '',
      quiz_answers: [],
      questions: [
        {
          question: '¿Por qué decimos Modeh Ani primero al despertar, incluso antes de levantarnos de la cama?',
          answers: ['¿Para quitarnos el mal aliento?', '¡Para agradecer a Hashem por nuestra alma, nuestra vida, de inmediato, antes de hacer cualquier otra cosa!', '¿Para poder faltar a la escuela?', '¿Para olvidar un mal sueño?'],
          correctAnswer: '¡Para agradecer a Hashem por nuestra alma, nuestra vida, de inmediato, antes de hacer cualquier otra cosa!',
          imageUrl: '/images/page7-1.jpg'
        },
        {
          question: '¿Qué es una Neshama?',
          answers: ['¿Un auto volador que va a la luna?', 'Nuestra alma, una chispa de Hashem que nos ayuda a pensar, sentir, amar y ser amables.', '¿Un submarino que parece una ballena?', '¿Un mono que toca la trompeta?'],
          correctAnswer: 'Nuestra alma, una chispa de Hashem que nos ayuda a pensar, sentir, amar y ser amables.',
          imageUrl: '/images/page7-3.jpg'
        },
        {
          question: '¿A dónde va nuestra Neshama cuando dormimos?',
          answers: ['¿Va de compras por juguetes?', '¿Visita el zoológico?', '¡Descansa con Hashem en el Cielo y regresa cuando nos despertamos!', '¿Se queda en nuestros zapatos?'],
          correctAnswer: '¡Descansa con Hashem en el Cielo y regresa cuando nos despertamos!',
          imageUrl: '/images/page7-4.jpg'
        },
        {
          question: '¿Por qué no decimos el nombre de Hashem en Modeh Ani?',
          answers: ['¿Porque lo olvidamos?', '¿Porque es demasiado temprano?', '¿Porque Spice es demasiado ruidoso?', '¡Porque aún no nos hemos lavado las manos! Decimos "Melech chai v\'kayam" (Rey vivo y eterno) en su lugar.'],
          correctAnswer: '¡Porque aún no nos hemos lavado las manos! Decimos "Melech chai v\'kayam" (Rey vivo y eterno) en su lugar.',
          imageUrl: '/images/page7-5.jpg'
        }
      ]
    },
    {
      page_type: 'story',
      text_top: '🌟 Modeh Ani 🌟',
      images: ['/images/page8-1.jpg'],
      text_bottom: 'מוֹדֶה אֲנִי לְפָנֶיךָ מֶלֶךְ חַי וְקַיָּם שֶׁהֶחֱזַרְתָּ בִּי נִשְׁמָתִי בְּחֶמְלָה רַבָּה אֱמוּנָתֶךָ\n\nModeh Ani lefanecha, Melech chai v\'kayam, Shehechezarta bi nishmati bechemlah, Rabba emunatecha.\n\nSignificado: Gracias, Hashem, por devolverme mi alma con bondad. ¡Cuán grande es Tu fidelidad!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Página de Risas',
      images: ['/images/giggle-page.jpg'],
      text_bottom: 'Shai: "Shira... ¿mi alma viene envuelta como un regalo de Janucá con un lazo?"\nSpice: "¡Por supuesto! En plástico de burbujas — ¡pop! ¡pop! ¡pop! ¡Amén!"\nShira: (riendo) "Modeh Ani significa \'Te agradezco\'."\nSpice: "Ohhh... Pensé que significaba \'¡Más Deli, cariño!\'"\nShai: "¡O \'Más Dinero Tonto!\'"\nSpice: "¡O \'Conejito Malhumorado!\'"\nTodos estallan en carcajadas y caen sobre las almohadas.\nShira: (todavía riendo) "¡Ustedes dos son imposibles!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: '🌟 La canción de Spice 🌟',
      images: ['/images/song-page.jpg'],
      text_bottom: 'Spice: (aclarándose la garganta dramáticamente, de pie en el poste de la cama) Con el tono de You’re my sunshine\n"Cada mañana cuando todavía estoy durmiendo, abro mis ojos y digo, ¡Gracias, Hashem, por mi Neshama, y por darme otro día!"\nLuego MUY fuerte y orgullosamente: continúa con el mismo tono\n"¡Modeh Ani Lefanecha, Melech chai v\'kayam, Shehechezarta bi nishmati bechemlah, Rabba emunatecha!"\nShira: (aplaudiendo) "¡Hermoso, Spice! ¡Recordaste cada palabra!"\nShai: "¡Suenas incluso mejor que un gallo de verdad!"\nSpice: (inflando el pecho) "No soy cualquier pollo — ¡soy un pollo AGRADECIDO! ¡Un pollo RECONOCIDO! Un—"\nShai y Shira: "¡Lo sabemos, Spice!"\nSpice: "¡¡¡KOO-KOO-REE-KOOOOO!!!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'back_cover',
      text_top: 'El Fin',
      images: ['/images/back-cover.jpg'],
      text_bottom: 'Un alegre cuento para antes de dormir y para la mañana que enseña gratitud, risas y una de las oraciones más importantes que todo niño judío aprende: Modeh Ani.',
      quiz_question: '',
      quiz_answers: []
    }
  ];

  const currentPage = pages[currentPageIndex] || pages[0];
  const totalPages = pages.length;
  const progressPercentage = ((currentPageIndex + 1) / totalPages) * 100;

  // Update quiz image when quiz question changes
  useEffect(() => {
    if (currentPage.page_type === 'interactive_quiz' && currentPage.questions && !quizCompleted) {
      const newImage = currentPage.questions[quizQuestionIndex]?.imageUrl || currentPage.images[0];
      console.log('Quiz image update - Question:', quizQuestionIndex, 'Image:', newImage);
      setCurrentQuizImage(newImage);
    } else {
      setCurrentQuizImage('');
    }
  }, [quizQuestionIndex, currentPageIndex, quizCompleted, currentPage]);

  console.log('Current page:', currentPageIndex, 'Images:', currentPage.images);

  // Stop audio when page changes (covers all navigation methods)
  useEffect(() => {
    // Skip on initial render
    if (isInitialRenderRef.current) {
      isInitialRenderRef.current = false;
      return;
    }

    console.log('Page changed to:', currentPageIndex, '- stopping audio');

    // Stop any playing audio when navigating to a new page
    if (audioRef.current) {
      if (timeUpdateRef.current) {
        audioRef.current.removeEventListener('ended', timeUpdateRef.current);
        audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setIsAutoPlay(false);
    }
  }, [currentPageIndex]);

  // Helper function to stop audio playback
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      if (timeUpdateRef.current) {
        audioRef.current.removeEventListener('ended', timeUpdateRef.current);
        audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
      audioRef.current.pause();
      setIsPlaying(false);
      setIsAutoPlay(false);
    }
  }, []);

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      stopAudio();
      setCurrentPageIndex(currentPageIndex - 1);
      setSelectedAnswer('');
      setQuizQuestionIndex(0);
      setQuizCompleted(false);
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      stopAudio();
      setCurrentPageIndex(currentPageIndex + 1);
      setSelectedAnswer('');
      setQuizQuestionIndex(0);
      setQuizCompleted(false);
    }
  };

  // Get audio URL for a given page index
  const getAudioUrl = useCallback((pageIdx: number): string | null => {
    const isEn = language === 'en';
    const baseUrl = isEn ? baseUrlEnglish : baseUrlSpanish;
    const files: any = isEn ? EnglishFiles : SpanishFiles;
    const pageKeys = [
      'intro', 'dedication', 'page3', 'page4', 'page5', 'page6',
      'page7', 'page8', 'page9', 'page10', 'page11', 'page12', 'page13'
    ];
    const fileKey = pageKeys[pageIdx];

    if (!fileKey || !files[fileKey]) return null;
    return `${baseUrl}${files[fileKey]}`;
  }, [language]);

  // Play audio for current page
  const playCurrentPageAudio = useCallback((autoAdvance: boolean = false) => {
    if (!audioRef.current) return;

    const pageIdx = currentPageIndexRef.current;
    const page = pages[pageIdx];
    const audioUrl = getAudioUrl(pageIdx);

    console.log('Playing audio for page:', page, pageIdx, 'url:', audioUrl);

    if (!audioUrl) {
      console.log('No audio URL for this page');
      // If autoplay and no audio, move to next page
      if (autoAdvance && pageIdx < totalPages - 1 && page.page_type !== 'interactive_quiz') {
        setCurrentPageIndex(prev => prev + 1);
        setSelectedAnswer('');
        setQuizQuestionIndex(0);
        setQuizCompleted(false);
      }
      return;
    }

    // Remove any existing listener
    if (timeUpdateRef.current) {
      audioRef.current.removeEventListener('ended', timeUpdateRef.current);
      audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
    }

    // Set the audio source and play
    audioRef.current.src = audioUrl;
    // Use start time if specified, otherwise start from beginning
    const splitTime = language === 'es' ? 16 : 17;
    const startTime = (pageIdx === 1) ? splitTime : 0;
    const endTime = (pageIdx === 0) ? undefined : undefined; // undefined means play to end
    // audioRef.current.currentTime = startTime;
    audioRef.current.play().catch(err => console.error('Audio playback error:', err));
    setIsPlaying(true);

    // Function to handle audio completion (either natural end or end time reached)
    const handleAudioComplete = () => {
      setIsPlaying(false);

      // Use refs to get current values
      const currentIdx = currentPageIndexRef.current;
      const currentPageData = pages[currentIdx];

      // If autoplay is enabled and not on quiz page, advance to next page
      if (isAutoPlayRef.current && currentPageData.page_type !== 'interactive_quiz') {
        if (currentIdx < totalPages - 1) {
          setCurrentPageIndex(currentIdx + 1);
          setSelectedAnswer('');
          setQuizQuestionIndex(0);
          setQuizCompleted(false);
        } else {
          // Reached the end, turn off autoplay
          setIsAutoPlay(false);
        }
      }
      // Note: For quiz pages, audio just stops after each question
      // User must answer correctly before next question's audio can be played manually
    };

    // If there's an end time, use timeupdate to check; otherwise use ended event
    if (endTime !== undefined) {
      const checkTime = () => {
        if (audioRef.current && audioRef.current.currentTime >= endTime) {
          audioRef.current.pause();
          audioRef.current.removeEventListener('timeupdate', checkTime);
          handleAudioComplete();
        }
      };
      timeUpdateRef.current = checkTime;
      audioRef.current.addEventListener('timeupdate', checkTime);
    } else {
      // No end time specified, play to natural end
      const onEnded = () => {
        handleAudioComplete();
      };
      timeUpdateRef.current = onEnded;
      audioRef.current.addEventListener('ended', onEnded);
    }
  }, [totalPages, getAudioUrl, pages]);

  // Handle autoplay page changes - only trigger when page changes, not when autoplay is first enabled
  const prevPageIndexRef = useRef(currentPageIndex);

  useEffect(() => {
    // Only auto-play if the page actually changed (not on initial autoplay toggle)
    const pageChanged = prevPageIndexRef.current !== currentPageIndex;
    prevPageIndexRef.current = currentPageIndex;

    if (isAutoPlay && currentPage.page_type !== 'interactive_quiz' && pageChanged) {
      // Small delay to let the page render before playing
      const timer = setTimeout(() => {
        playCurrentPageAudio(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [currentPageIndex, isAutoPlay, currentPage.page_type, playCurrentPageAudio]);

  // Stop audio and clean up when page changes manually or autoplay is toggled off
  useEffect(() => {
    if (!isAutoPlay && audioRef.current) {
      // Clean up listener
      if (timeUpdateRef.current) {
        audioRef.current.removeEventListener('ended', timeUpdateRef.current);
        audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, [isAutoPlay]);

  // Pause autoplay when reaching quiz
  useEffect(() => {
    if (isAutoPlay && currentPage.page_type === 'interactive_quiz') {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setIsAutoPlay(false);
    }
  }, [currentPageIndex, currentPage.page_type, isAutoPlay]);

  const handleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      // Stop playing
      if (timeUpdateRef.current) {
        audioRef.current.removeEventListener('ended', timeUpdateRef.current);
        audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // Manual play (not auto-advance)
    playCurrentPageAudio(false);
  };

  const toggleAutoPlay = () => {
    if (isAutoPlay) {
      // Turn off autoplay
      setIsAutoPlay(false);
      if (audioRef.current) {
        if (timeUpdateRef.current) {
          audioRef.current.removeEventListener('ended', timeUpdateRef.current);
          audioRef.current.removeEventListener('timeupdate', timeUpdateRef.current);
          timeUpdateRef.current = null;
        }
        audioRef.current.pause();
        setIsPlaying(false);
      }
    } else {
      // Turn on autoplay - start playing current page immediately
      setIsAutoPlay(true);
      // Use setTimeout to ensure state is updated before playing
      setTimeout(() => {
        playCurrentPageAudio(true);
      }, 100);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (currentPage.page_type === 'interactive_quiz' && !quizCompleted) {
      const currentQuestion = currentPage.questions?.[quizQuestionIndex];
      if (currentQuestion && answer === currentQuestion.correctAnswer) {
        // Correct answer
        setSelectedAnswer(answer);
        setTimeout(() => {
          if (quizQuestionIndex < (currentPage.questions?.length || 0) - 1) {
            setQuizQuestionIndex(prev => prev + 1);
            setSelectedAnswer('');
          } else {
            setQuizCompleted(true);
            setSelectedAnswer('');
          }
        }, 1000);
      } else {
        // Incorrect answer - maybe shake or show error?
        // For now just select it to show it was clicked
        setSelectedAnswer(answer);
      }
    } else {
      setSelectedAnswer(answer);
    }
  };


  useEffect(() => {
    isAutoPlayRef.current = isAutoPlay;
  }, [isAutoPlay]);

  const renderText = (text: string) => {
    return text.split('\n').map((line, index) => {
      const match = line.match(/^([A-Za-z &]+):(.+)/);
      if (match) {
        return (
          <span key={index} className="block mb-2">
            <span className="font-bold text-gray-900">{match[1]}:</span>
            <span className="text-gray-800">{match[2]}</span>
          </span>
        );
      }
      return (
        <span key={index} className="block mb-2 italic text-gray-600 font-medium bg-yellow-50/50 p-2 rounded-lg border-l-4 border-yellow-300 text-sm md:text-base">
          {line}
        </span>
      );
    });
  };

  return (
    <div className="h-screen bg-gradient-to-b from-yellow-100 to-orange-100 flex flex-col overflow-hidden">
      {/* Language Toggle */}
      <div className="absolute top-4 right-4 z-50 flex bg-white/80 backdrop-blur rounded-full p-1 shadow-sm border border-gray-200">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded-full transition-colors ${language === 'en' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('es')}
          className={`px-3 py-1.5 text-xs md:text-sm font-bold rounded-full transition-colors ${language === 'es' ? 'bg-blue-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ES
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 flex items-center justify-center p-2 md:p-4">
          {/* Apply vertical layout when enabled */}
          {useVerticalLayout ? (
            /* Vertical Layout: Text - Image - Text */
            <Card className="w-full max-w-2xl h-full bg-white/95 backdrop-blur shadow-2xl rounded-3xl overflow-hidden border-none ring-1 ring-black/5 flex flex-col">
              <CardContent className="p-4 md:p-6 h-full flex flex-col overflow-hidden">
                {(() => {
                  // Check if this is a quiz page
                  const isQuizPage = currentPage.page_type === 'interactive_quiz';
                  // Check if this is the cover page
                  const isCoverPage = currentPage.page_type === 'cover';
                  // Pages that should have all text below the image (cleaner UI for cover-style pages)
                  const isSimplePage = ['cover', 'dedication', 'back_cover'].includes(currentPage.page_type);
                  const lines = currentPage.text_bottom ? currentPage.text_bottom.split('\n') : [];

                  // Only split text for story pages with more than 4 lines
                  const shouldSplitText = !isSimplePage && !isQuizPage && lines.length > 4;
                  const halfIndex = Math.ceil(lines.length / 2);
                  const topLines = shouldSplitText ? lines.slice(0, halfIndex).join('\n') : '';
                  const bottomLines = shouldSplitText ? lines.slice(halfIndex).join('\n') : currentPage.text_bottom || '';

                  // Cover page special layout - title on top, image in middle, author at bottom
                  if (isCoverPage) {
                    return (
                      <>
                        {/* Title at top */}
                        {currentPage.text_top && (
                          <div className="flex-none py-2">
                            <div className="text-center">
                              <p className="text-xl md:text-2xl font-bold text-gray-800 leading-tight whitespace-pre-line font-serif">
                                {currentPage.text_top}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Cover Image - fixed height */}
                        <div className="h-3/5 flex-none flex flex-col my-2">
                          <div className="w-full h-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                            {imageErrors.has(currentPage.images[0]) ? (
                              <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                            ) : (
                              <img
                                src={currentPage.images[0]}
                                alt="Cover illustration"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                              />
                            )}
                          </div>
                        </div>

                        {/* Author at bottom */}
                        {currentPage.text_bottom && (
                          <div className="flex-none py-2">
                            <div className="text-center">
                              <p className="text-base md:text-lg italic text-gray-600 font-medium">
                                {currentPage.text_bottom}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }

                  // Dedication page special layout - text on top, image in middle, bottom text
                  if (currentPage.page_type === 'dedication') {
                    return (
                      <>
                        {/* Dedication text at top */}
                        {currentPage.text_top && (
                          <div className="flex-none py-2 overflow-y-auto max-h-[30%]">
                            <div className="text-center">
                              <p className="text-sm md:text-base text-gray-700 leading-relaxed whitespace-pre-line font-serif italic">
                                {currentPage.text_top}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Dedication Image */}
                        <div className="h-1/2 flex-none flex flex-col my-2">
                          <div className="w-full h-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                            {imageErrors.has(currentPage.images[0]) ? (
                              <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                            ) : (
                              <img
                                src={currentPage.images[0]}
                                alt="Dedication illustration"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                              />
                            )}
                          </div>
                        </div>

                        {/* Bottom text */}
                        {currentPage.text_bottom && (
                          <div className="flex-none py-2">
                            <div className="text-center">
                              <p className="text-base md:text-lg font-medium text-gray-700">
                                {currentPage.text_bottom}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }

                  // Quiz page layout
                  if (isQuizPage) {
                    return (
                      <>
                        {/* Quiz Question on top */}
                        {!quizCompleted && (
                          <div className="flex-none py-3">
                            <h2 className="text-lg md:text-xl font-bold text-red-500 leading-relaxed text-center">
                              {currentPage.questions?.[quizQuestionIndex].question}
                            </h2>
                          </div>
                        )}

                        {/* Quiz completed message */}
                        {quizCompleted && (
                          <div className="flex-none py-3">
                            <h2 className="text-lg md:text-xl font-bold text-green-500 leading-relaxed text-center">
                              {t.quizCompleted}
                            </h2>
                          </div>
                        )}

                        {/* Image in middle */}
                        <div className="h-1/3 flex-none flex flex-col gap-2 my-2">
                          <div className="w-full h-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                            {imageErrors.has(currentPage.images[0]) ? (
                              <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                            ) : (
                              <img
                                src={currentPage.images[0]}
                                alt="Quiz illustration"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                              />
                            )}
                          </div>
                        </div>

                        {/* Quiz Answers below image */}
                        {!quizCompleted && (
                          <div className="flex-1 overflow-y-auto py-2">
                            <div className="grid grid-cols-1 gap-2">
                              {currentPage.questions?.[quizQuestionIndex].answers.map((answer, index) => (
                                <Button
                                  key={index}
                                  variant={selectedAnswer === answer ? "default" : "outline"}
                                  className={`p-3 text-sm md:text-base font-medium rounded-xl transition-all duration-200 whitespace-normal h-auto justify-start text-left ${selectedAnswer === answer
                                    ? (answer === currentPage.questions?.[quizQuestionIndex].correctAnswer
                                      ? 'bg-green-500 hover:bg-green-600 text-white'
                                      : 'bg-red-500 hover:bg-red-600 text-white')
                                    : 'bg-white hover:bg-green-50 text-gray-700 border-2 border-green-100'
                                    }`}
                                  onClick={() => handleAnswerSelect(answer)}
                                >
                                  {answer}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Show text_bottom when quiz is completed */}
                        {quizCompleted && currentPage.text_bottom && (
                          <div className="flex-1 overflow-y-auto p-2">
                            <div className="space-y-1 text-sm md:text-base">
                              {renderText(currentPage.text_bottom)}
                            </div>
                          </div>
                        )}
                      </>
                    );
                  }

                  // Regular page layout
                  return (
                    <>
                      {/* Top Text Section - Only show title for simple pages, or title + split text for story pages */}
                      {(currentPage.text_top || shouldSplitText) && (
                        <div className={`${isSimplePage ? 'flex-none' : 'flex-1'} overflow-y-auto py-2`}>
                          {currentPage.text_top && (
                            <div className="text-center mb-2">
                              <p className="text-lg md:text-2xl font-bold text-gray-800 leading-relaxed whitespace-pre-line font-serif">
                                {currentPage.text_top}
                              </p>
                            </div>
                          )}
                          {shouldSplitText && topLines && (
                            <div className="p-2">
                              <div className="space-y-1 text-sm md:text-base">
                                {renderText(topLines)}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Image Section - Larger for simple pages */}
                      <div className={`${isSimplePage ? 'h-2/3' : 'h-2/5'} flex-none flex flex-col gap-2 my-2`}>
                        {currentPage.images.length === 1 ? (
                          <div className="w-full h-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                            {imageErrors.has(currentPage.images[0]) ? (
                              <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                            ) : (
                              <img
                                src={currentPage.images[0]}
                                alt="Story illustration"
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                              />
                            )}
                          </div>
                        ) : currentPage.images.length === 2 ? (
                          <>
                            <div className="h-1/2 w-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                              {imageErrors.has(currentPage.images[0]) ? (
                                <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                              ) : (
                                <img
                                  src={currentPage.images[0]}
                                  alt="Story illustration 1"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                                />
                              )}
                            </div>
                            <div className="h-1/2 w-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                              {imageErrors.has(currentPage.images[1]) ? (
                                <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                              ) : (
                                <img
                                  src={currentPage.images[1]}
                                  alt="Story illustration 2"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[1]))}
                                />
                              )}
                            </div>
                          </>
                        ) : (
                          /* Three Images */
                          <>
                            <div className="h-1/2 w-full flex gap-2">
                              <div className="flex-1 relative  rounded-2xl overflow-hidden">
                                {imageErrors.has(currentPage.images[0]) ? (
                                  <div className="text-4xl flex items-center justify-center h-full w-full">🌻</div>
                                ) : (
                                  <img
                                    src={currentPage.images[0]}
                                    alt="Story illustration 1"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                                  />
                                )}
                              </div>
                              <div className="flex-1 relative  rounded-2xl overflow-hidden">
                                {imageErrors.has(currentPage.images[1]) ? (
                                  <div className="text-4xl flex items-center justify-center h-full w-full">🌻</div>
                                ) : (
                                  <img
                                    src={currentPage.images[1]}
                                    alt="Story illustration 2"
                                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[1]))}
                                  />
                                )}
                              </div>
                            </div>
                            <div className="h-1/2 w-full relative flex items-center justify-center  rounded-2xl overflow-hidden">
                              {imageErrors.has(currentPage.images[2]) ? (
                                <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                              ) : (
                                <img
                                  src={currentPage.images[2]}
                                  alt="Story illustration main"
                                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                  onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[2]))}
                                />
                              )}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Bottom Text Section */}
                      {bottomLines && (
                        <div className="flex-1 overflow-y-auto p-2">
                          <div className="space-y-1 text-sm md:text-base">
                            {renderText(bottomLines)}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          ) : (
            /* Original Side-by-Side Layout */
            <Card className="w-full max-w-6xl h-full bg-white/95 backdrop-blur shadow-2xl rounded-3xl overflow-hidden border-none ring-1 ring-black/5 flex flex-col md:flex-row">

              {/* Image Section */}
              <div className="w-full md:w-1/2 h-2/3 sm:h-64 md:h-full  flex flex-col gap-1 relative flex-none">
                {currentPage.images.length === 1 ? (
                  /* Single Image Layout - For quiz pages, show question-specific image */
                  <div className="w-full h-full relative flex items-center justify-center bg-white/50 overflow-hidden">
                    {(() => {
                      const imageToShow = currentPage.page_type === 'interactive_quiz' && !quizCompleted && currentQuizImage
                        ? currentQuizImage
                        : currentPage.images[0];
                      return imageErrors.has(imageToShow) ? (
                        <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                      ) : (
                        <img
                          key={imageToShow}
                          src={imageToShow}
                          alt="Story illustration"
                          className="w-full h-full object-cover object-[top_center] hover:scale-105 transition-transform duration-500"
                          onError={() => setImageErrors(prev => new Set(prev).add(imageToShow))}
                        />
                      );
                    })()}
                  </div>
                ) : currentPage.images.length === 2 ? (
                  /* Two Images Layout - Top and Bottom */
                  <>
                    <div className="h-1/2 w-full relative flex items-center justify-center bg-white/50 overflow-hidden">
                      {imageErrors.has(currentPage.images[0]) ? (
                        <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                      ) : (
                        <img
                          src={currentPage.images[0]}
                          alt="Story illustration 1"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 999"
                          onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                        />
                      )}
                    </div>
                    <div className="h-1/2 w-full relative flex items-center justify-center bg-white/50 overflow-hidden">
                      {imageErrors.has(currentPage.images[1]) ? (
                        <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                      ) : (
                        <img
                          src={currentPage.images[1]}
                          alt="Story illustration 2"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 1010"
                          onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[1]))}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  /* Three Images Layout - Two small top, one large bottom */
                  <>
                    {/* Top Two Square Images */}
                    <div className="h-1/2 w-full flex gap-1">
                      <div className="flex-1 relative bg-white/50 overflow-hidden">
                        {imageErrors.has(currentPage.images[0]) ? (
                          <div className="text-4xl flex items-center justify-center h-full w-full">🌻</div>
                        ) : (
                          <img
                            src={currentPage.images[0]}
                            alt="Story illustration 1"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[0]))}
                          />
                        )}
                      </div>
                      <div className="flex-1 relative bg-white/50 overflow-hidden">
                        {imageErrors.has(currentPage.images[1]) ? (
                          <div className="text-4xl flex items-center justify-center h-full w-full">🌻</div>
                        ) : (
                          <img
                            src={currentPage.images[1]}
                            alt="Story illustration 2"
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[1]))}
                          />
                        )}
                      </div>
                    </div>

                    {/* Bottom Large Image */}
                    <div className="h-1/2 w-full relative flex items-center justify-center bg-white/50 overflow-hidden">
                      {imageErrors.has(currentPage.images[2]) ? (
                        <div className="text-6xl flex items-center justify-center h-full w-full">🌻</div>
                      ) : (
                        <img
                          src={currentPage.images[2]}
                          alt="Story illustration main"
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 1011"
                          onError={() => setImageErrors(prev => new Set(prev).add(currentPage.images[2]))}
                        />
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Content Section */}
              <div className="w-full md:w-1/2 flex-1 md:h-full overflow-y-auto bg-white">
                <CardContent className="p-4 md:p-8 flex flex-col justify-center min-h-full space-y-4">
                  {/* Top Text */}
                  {currentPage.text_top && currentPage.page_type !== 'interactive_quiz' && (
                    <div className="text-center">
                      <p className="text-lg md:text-2xl font-bold text-gray-800 leading-relaxed whitespace-pre-line font-serif">
                        {currentPage.text_top}
                      </p>
                    </div>
                  )}

                  {/* Quiz Question */}
                  {(currentPage.quiz_question || (currentPage.page_type === 'interactive_quiz' && !quizCompleted)) && (
                    <div className="text-center">
                      <h2 className="text-xl md:text-3xl font-bold text-red-500 leading-relaxed">
                        {currentPage.page_type === 'interactive_quiz'
                          ? currentPage.questions?.[quizQuestionIndex].question
                          : currentPage.quiz_question}
                      </h2>
                    </div>
                  )}

                  {/* Bottom Text */}
                  {(currentPage.text_bottom && (currentPage.page_type !== 'interactive_quiz' || quizCompleted)) && (
                    <div className={`text-left ${currentPage.text_top.includes('🌟') ? 'text-center' : ''}`}>
                      <div className="text-base md:text-xl text-gray-700 leading-relaxed font-serif">
                        {currentPage.text_top === '🌟 Modeh Ani 🌟'
                          ? currentPage.text_bottom.split('\n').map((line, i) => (
                            <p key={i} className={`mb-4 ${i === 0 ? 'text-2xl font-bold text-blue-600' : ''} ${line.startsWith(t.meaning) || line.startsWith('Meaning:') ? 'italic text-gray-600 mt-6' : ''}`}>
                              {line}
                            </p>
                          ))
                          : renderText(currentPage.text_bottom)
                        }
                        {currentPage.text_top.includes('🌟') && (
                          <div className="flex justify-center mt-6">
                            <Button
                              size="lg"
                              onClick={handleAudio}
                              className="bg-yellow-500 hover:bg-yellow-600 text-white rounded-full px-8 py-6 text-xl shadow-lg hover:scale-105 transition-transform"
                            >
                              <Volume2 className="mr-3 h-6 w-6" /> {t.listenToSong}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Quiz Answers */}
                  {((currentPage.quiz_answers && currentPage.quiz_answers.length > 0) || (currentPage.page_type === 'interactive_quiz' && !quizCompleted)) && (
                    <div className="grid grid-cols-1 gap-3 pt-4">
                      {(currentPage.page_type === 'interactive_quiz'
                        ? currentPage.questions?.[quizQuestionIndex].answers
                        : currentPage.quiz_answers
                      )?.map((answer, index) => (
                        <Button
                          key={index}
                          variant={selectedAnswer === answer ? "default" : "outline"}
                          className={`p-4 text-lg font-medium rounded-xl transition-all duration-200 whitespace-normal h-auto justify-start text-left ${selectedAnswer === answer
                            ? (currentPage.page_type === 'interactive_quiz' && answer === currentPage.questions?.[quizQuestionIndex].correctAnswer
                              ? 'bg-green-500 hover:bg-green-600 text-white'
                              : currentPage.page_type === 'interactive_quiz'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white')
                            : 'bg-white hover:bg-green-50 text-gray-700 border-2 border-green-100'
                            }`}
                          onClick={() => handleAnswerSelect(answer)}
                        >
                          {answer}
                        </Button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex-none bg-white shadow-lg p-4 z-10">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          {/* Main Navigation Row */}
          <div className="flex items-center justify-between gap-2 md:gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentPageIndex === 0 || isAutoPlay}
              className="flex-none flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-3 text-base md:text-lg font-medium rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="hidden md:inline">{t.previous}</span>
              <span className="md:hidden">{t.prev}</span>
            </Button>

            {/* Audio Controls - Center */}
            <div className="flex items-center gap-2">
              {/* Auto Play Toggle */}
              <Button
                variant="outline"
                size="lg"
                onClick={toggleAutoPlay}
                className={`flex-none flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-3 text-base md:text-lg font-medium rounded-xl border-2 transition-all duration-200 ${isAutoPlay
                  ? 'bg-purple-500 text-white border-purple-500 hover:bg-purple-600'
                  : 'bg-white text-purple-600 border-purple-300 hover:bg-purple-50'
                  }`}
              >
                {isAutoPlay ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span className="hidden md:inline">{t.auto}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span className="hidden md:inline">{t.auto}</span>
                  </>
                )}
              </Button>

              {/* Manual Listen Button */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleAudio}
                disabled={isAutoPlay}
                className={`flex-none flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-3 text-base md:text-lg font-medium rounded-xl border-2 transition-all duration-200 ${isPlaying && !isAutoPlay
                  ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                  : isAutoPlay
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-green-600 border-green-300 hover:bg-green-50'
                  }`}
              >
                {isPlaying && !isAutoPlay ? (
                  <>
                    <Square className="w-5 h-5" />
                    <span className="hidden md:inline">{t.stop}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5" />
                    <span>{t.listen}</span>
                  </>
                )}
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={currentPageIndex === totalPages - 1 || (currentPage.page_type === 'interactive_quiz' && !quizCompleted) || isAutoPlay}
              className="flex-none flex items-center justify-center gap-1 md:gap-2 px-3 md:px-6 py-3 text-base md:text-lg font-medium rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50"
            >
              <span className="hidden md:inline">{t.next}</span>
              <span className="md:hidden">{t.next}</span>
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Bar Row */}
          <div className="w-full max-w-md mx-auto flex flex-col gap-1">
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>{currentPageIndex + 1}/{totalPages}</span>
              <span>{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageContainer;

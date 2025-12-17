import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';

interface Page {
  page_type: 'cover' | 'dedication' | 'story' | 'quiz' | 'back_cover';
  text_top: string;
  image_url: string;
  text_bottom: string;
  quiz_question: string;
  quiz_answers: string[];
}

const PageContainer: React.FC = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');

  const pages: Page[] = [
    {
      page_type: 'cover',
      text_top: 'Shprintza \'n Spice: Modeh Ani Song',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Written by Rabbi Yossi Srugo',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'dedication',
      text_top: 'Dedicated to all the children I\'ve had the privilege of welcoming into the world — performing their Brit Milah, the sacred moment when their Neshama first enters their body. — Rabbi Yossi Srugo',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Happy Reading!',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Shai opened his eyes and sighed a big, sleepy sigh.\nShai: "Ugh… I\'m soooo sad. I don\'t have a new toy today."\nSuddenly, Shprintza appeared beside him, her face glowing with warmth.\nShprintza: "Good morning, Shai! You know, your biggest gift isn\'t a new toy."',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Shai: "It\'s not? But toys are the BEST!"\nSpice flapped dramatically onto the pillow.\nSpice: "Koo-koo-ree-koo! Boker Tov, yeladim! The biggest gift is… a BAG FULL OF YUMMY WORMS!"\nShai: "EWWWW! Spice, that\'s gross!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Shprintza: "Shai, every single morning Hashem gives us the most amazing present of all."\nShai: "Better than a LEGO spaceship with two astronauts AND a laser cannon?"\nSpice: "Better than a mountain of cornflakes with extra seeds on top?"\nShprintza: (smiling patiently) "Even better! Hashem gives you back your Neshama — your soul!"',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Shai: "My Nesh-a-ma? What\'s that? Can I play with it?"\nShprintza: "Your Neshama is the spark of Hashem inside you — it\'s what makes you alive! It helps you think, feel, love, and be kind."\nShai: "Ohhh! Is THAT why I can think of silly jokes?"\nSpice: "Or FLYYYY?!" (flaps wildly and bumps into the lamp)\nShprintza: (laughing softly) "Exactly, Shai."',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Shprintza: "When we sleep, our Neshama rests with Hashem. It goes up to Heaven! And when we wake up… Hashem sends it right back to us."\nShai: "Whoa! So my Neshama goes on a trip every night?"\nShprintza: "Yes! That\'s why we say Modeh Ani the very first thing when we wake up — even before we get out of bed, even before we wash our hands — to thank Hashem for giving us life again."',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Spice: "I\'m thankful for my magnificent feathers!" (poses like a supermodel)\nShai: "So I get my soul back every single morning? Even on Mondays?!"\nShprintza: "Every beautiful day, Shai. Every single one."\nSpice: "And I get… BREAKFAST! Koo-koo-ree-koo!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Shprintza: "Let\'s celebrate being alive!"\nThey begin to sing and dance around the room:\nShprintza & Shai: "I\'m alive! I\'m alive! Hashem gave me my soul inside!"',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Spice: (spinning in circles) "I\'m aliiiive! Koo-koo-ree-koo! ¡Estoy vivo! Ani chai! Koo-koo-ree-koo!"\nShai: (jumping on the bed) "This is better than toys!"',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'The wise old oak tree pointed toward the meadow with his branches.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'The friendly rabbit offered to hop ahead and show the way.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Together, all the garden friends helped guide the butterfly.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'They followed a path of colorful flowers that led to the meadow.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Soon, the butterfly saw her family dancing among the wildflowers.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'She was so happy and grateful to all her new friends in the garden.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'quiz',
      text_top: '',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: '',
      quiz_question: 'What is the name of the sunflower in our story?',
      quiz_answers: ['Sunny', 'Daisy', 'Rose', 'Lily']
    },
    {
      page_type: 'quiz',
      text_top: '',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: '',
      quiz_question: 'Who was lost in the garden?',
      quiz_answers: ['A butterfly', 'A bee', 'A bird', 'A ladybug']
    },
    {
      page_type: 'quiz',
      text_top: '',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: '',
      quiz_question: 'Which tree helped show the way?',
      quiz_answers: ['Oak tree', 'Apple tree', 'Pine tree', 'Maple tree']
    },
    {
      page_type: 'quiz',
      text_top: '',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: '',
      quiz_question: 'Where did the butterfly find her family?',
      quiz_answers: ['In the meadow', 'In the pond', 'On the fence', 'Under a rock']
    },
    {
      page_type: 'story',
      text_top: 'From that day on, the butterfly would visit Sunny every morning.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'They became the very best of friends and had many more adventures.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Sunny learned that helping others always makes you feel happy inside.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'The garden became an even more wonderful place because everyone cared for each other.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'Every sunset, all the garden friends would gather around Sunny.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'They would share stories and laugh together as the stars came out to play.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'story',
      text_top: 'And so, Sunny the sunflower continued to spread joy and kindness.',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'The garden was filled with love, friendship, and endless sunny days.',
      quiz_question: '',
      quiz_answers: []
    },
    {
      page_type: 'back_cover',
      text_top: 'Thank you for reading about Sunny the Sunflower!',
      image_url: 'https://example.com/placeholder.jpg',
      text_bottom: 'Remember to always be kind and help your friends, just like Sunny did.',
      quiz_question: '',
      quiz_answers: []
    }
  ];

  const currentPage = pages[currentPageIndex] || pages[0];
  const totalPages = pages.length;
  const progressPercentage = ((currentPageIndex + 1) / totalPages) * 100;

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
      setSelectedAnswer('');
    }
  };

  const handleNext = () => {
    if (currentPageIndex < totalPages - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
      setSelectedAnswer('');
    }
  };

  const handleAudio = () => {
    // Audio functionality would be implemented here
    console.log('Playing audio for current page');
  };

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-orange-100 flex flex-col">
      {/* Progress Bar */}
      <div className="w-full bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Page {currentPageIndex + 1} of {totalPages}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(progressPercentage)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-red-400 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <Card className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* Top Text */}
            {currentPage.text_top && (
              <div className="text-center mb-6">
                <p className="text-2xl md:text-3xl font-bold text-gray-800 leading-relaxed whitespace-pre-line">
                  {currentPage.text_top}
                </p>
              </div>
            )}

            {/* Quiz Question */}
            {currentPage.quiz_question && (
              <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-red-500 leading-relaxed">
                  {currentPage.quiz_question}
                </h2>
              </div>
            )}

            {/* Image */}
            <div className="flex justify-center mb-6">
              <div className="w-full max-w-md h-64 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-xl flex items-center justify-center border-4 border-yellow-300">
                <img 
                  src={currentPage.image_url} 
                  alt="Story illustration"
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = '<div class="text-6xl">🌻</div>';
                  }}
                />
              </div>
            </div>

            {/* Bottom Text */}
            {currentPage.text_bottom && (
              <div className="text-center mb-6">
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed whitespace-pre-line">
                  {currentPage.text_bottom}
                </p>
              </div>
            )}

            {/* Quiz Answers */}
            {currentPage.quiz_answers && currentPage.quiz_answers.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentPage.quiz_answers.map((answer, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswer === answer ? "default" : "outline"}
                    className={`p-4 text-lg font-medium rounded-xl transition-all duration-200 ${
                      selectedAnswer === answer 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-white hover:bg-green-50 text-gray-700 border-2 border-green-300'
                    }`}
                    onClick={() => handleAnswerSelect(answer)}
                  >
                    {answer}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white shadow-lg p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={handlePrevious}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleAudio}
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl border-2 border-yellow-400 hover:bg-yellow-50 bg-yellow-100"
          >
            <Volume2 className="w-5 h-5" />
            Listen
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={handleNext}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-2 px-6 py-3 text-lg font-medium rounded-xl border-2 border-red-300 hover:bg-red-50 disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageContainer;
import { useState } from 'react'
import PageContainer from './components/PageContainer'
import ProgressBar from './components/ProgressBar'
import StoryPageLayout from './components/StoryPageLayout'
import QuizPageLayout from './components/QuizPageLayout'
import NavigationControls from './components/NavigationControls'
import AudioButton from './components/AudioButton'
import CoverPageLayout from './components/CoverPageLayout'

const pages = [
  {
    page_type: 'cover',
    text_top: 'My First Adventure Book',
    image_url: '/images/RESIZE 3_4 - Front Cover.jpg',
    text_bottom: 'A Fun Story for Young Readers',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20intro.mp3'
  },
  {
    page_type: 'dedication',
    text_top: 'This book is dedicated to all curious young minds',
    image_url: '/images/RESIZE 3_4 - Dedication page.jpg',
    text_bottom: 'Happy reading!',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20intro.mp3'
  },
  {
    page_type: 'story',
    text_top: 'Once upon a time, there was a brave little mouse.',
    image_url: '/images/RESIZE 3_2 - page 2.1 top.jpg',
    text_bottom: 'The mouse loved to explore new places.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20p.%203.mp3'
  },
  {
    page_type: 'story',
    text_top: 'One day, the mouse found a magical garden.',
    image_url: '/images/RESIZE 3_2 - page 2.2 bottom.jpg',
    text_bottom: 'The flowers sparkled in the sunlight.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20p.%204.mp3'
  },
  {
    page_type: 'story',
    text_top: 'In the garden, the mouse met a friendly butterfly.',
    image_url: '/images/RESIZE 3_4 - page 3.jpg',
    text_bottom: 'They became the best of friends.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20p.%205.mp3'
  },
  {
    page_type: 'story',
    text_top: 'The butterfly showed the mouse around the garden.',
    image_url: '/images/RESIZE 3_4 - page 4 .jpg',
    text_bottom: 'There were so many wonderful things to see.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20Spice%20p.%206.mp3'
  },
  {
    page_type: 'story',
    text_top: 'They discovered a hidden pond with lily pads.',
    image_url: '/images/RESIZE 3_4  - page 5.jpg',
    text_bottom: 'The water was crystal clear and cool.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20Spice%20p.%207.mp3'
  },
  {
    page_type: 'story',
    text_top: 'Near the pond lived a wise old frog.',
    image_url: '/images/RESIZE 3_4 - Page 8 .jpg',
    text_bottom: 'The frog had many stories to tell.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20Spice%20p.%208.mp3'
  },
  {
    page_type: 'story',
    text_top: 'The frog told them about a treasure hidden nearby.',
    image_url: '/images/RESIZE 3_4 - page 9 .jpg',
    text_bottom: 'The mouse and butterfly were very excited.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20p9.mp3'
  },
  {
    page_type: 'quiz',
    text_top: '',
    image_url: '/images/RESIZE 3_2 - Quiz 1 .jpg',
    text_bottom: '',
    quiz_question: 'What did the mouse find in the story?',
    quiz_answers: ['A magical garden', 'A big house', 'A toy car', 'A sandwich'],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20q1.mp3',
    quiz_questions: [
      {
        question: 'What did the mouse find in the story?',
        imageUrl: '/images/RESIZE 3_2 - Quiz 1 .jpg',
        answers: ['A magical garden', 'A big house', 'A toy car', 'A sandwich']
      },
      {
        question: "Who became the mouse's friend?",
        imageUrl: '/images/RESIZE 3_2 - Quiz 2.jpg',
        answers: ['A butterfly', 'A cat', 'A dog', 'A bird']
      },
      {
        question: 'What did they find near the pond?',
        imageUrl: '/images/RESIZE 3_2 - Quiz 3.jpg',
        answers: ['A wise old frog', 'A big rock', 'Some fish', 'A boat']
      },
      {
        question: 'What did the frog tell them about?',
        imageUrl: '/images/RESIZE 3_2 - Quiz 4 .jpg',
        answers: ['A hidden treasure', 'The weather', 'A recipe', 'A game']
      }
    ]
  },
  {
    page_type: 'story',
    text_top: 'Together, they searched for the treasure.',
    image_url: '/images/RESIZE 3_4 - page 10 .jpg',
    text_bottom: 'They looked under rocks and behind trees.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20p10.mp3'
  },
  {
    page_type: 'story',
    text_top: 'Finally, they found a small golden acorn.',
    image_url: '/images/RESIZE 1_1 - page 6.2.jpg',
    text_bottom: 'It glowed with a warm, magical light.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: 'https://dnltfxiymdfqmxtdbicj.supabase.co/storage/v1/object/public/audio/new_audio/Shira%20n%20spice%20p11.mp3'
  },
  {
    page_type: 'story',
    text_top: 'The acorn granted them one special wish.',
    image_url: '/images/RESIZE 1_1 - page 6.2 (2).jpg',
    text_bottom: 'They wished for friendship to last forever.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: ''
  },
  {
    page_type: 'story',
    text_top: 'From that day on, they had many more adventures.',
    image_url: '/images/RESIZE 3_2 - page 6.3 .jpg',
    text_bottom: 'And they lived happily ever after. The End.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: ''
  },
  {
    page_type: 'back_cover',
    text_top: 'Thank you for reading!',
    image_url: '/images/RESIZE 3_4 - back cover.jpg',
    text_bottom: 'We hope you enjoyed this adventure.',
    quiz_question: '',
    quiz_answers: [],
    audio_url: ''
  }
]

export default function App() {
  const [currentPage, setCurrentPage] = useState(0)

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  const page = pages[currentPage]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-green-100">
      <PageContainer>
        <ProgressBar current={currentPage + 1} total={pages.length} />
        
        {page.page_type === 'cover' || page.page_type === 'back_cover' ? (
          <CoverPageLayout 
            title={page.text_top}
            subtitle={page.text_bottom}
            imageUrl={page.image_url}
            isBackCover={page.page_type === 'back_cover'}
            currentPage={currentPage + 1}
            totalPages={pages.length}
            onPrevious={currentPage > 0 ? prevPage : undefined}
            onNext={currentPage < pages.length - 1 ? nextPage : undefined}
          />
        ) : page.page_type === 'quiz' ? (
          <QuizPageLayout 
            key={`quiz-${currentPage}`}
            question={page.quiz_question}
            imageUrl={page.image_url}
            answers={page.quiz_answers}
            questions={(page as any).quiz_questions}
            currentPage={currentPage + 1}
            totalPages={pages.length}
            onPrevious={currentPage > 0 ? prevPage : undefined}
            onNext={currentPage < pages.length - 1 ? nextPage : undefined}
          />
        ) : (
          <StoryPageLayout 
            textTop={page.text_top}
            imageUrl={page.image_url}
            textBottom={page.text_bottom}
            currentPage={currentPage + 1}
            totalPages={pages.length}
            onPrevious={currentPage > 0 ? prevPage : undefined}
            onNext={currentPage < pages.length - 1 ? nextPage : undefined}
          />
        )}
        
        <div className="flex justify-between items-center mt-6">
          <NavigationControls 
            onPrev={prevPage} 
            onNext={nextPage}
            canGoPrev={currentPage > 0}
            canGoNext={currentPage < pages.length - 1}
          />
          <AudioButton 
            audioSrc={page.audio_url} 
            disabled={!page.audio_url}
          />
        </div>
      </PageContainer>
    </div>
  )
}
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlickeringGrid } from '../components/FlickeringGrid';
import { BoxReveal } from '../registry/magicui/box-reveal';

interface Question {
  id: number;
  question: string;
  options: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: 'How many sources have you tried to improve your online presence?',
    options: ['1-2', '3-5', 'More than 5', 'None'],
  },
  {
    id: 2,
    question: 'What\'s your biggest challenge with digital marketing?',
    options: ['Generating leads', 'Increasing website traffic', 'Converting visitors into customers', 'Measuring results'],
  },
  {
    id: 3,
    question: 'How much time do you spend managing your social media accounts every week?',
    options: ['Less than 2 hours', '2-5 hours', '5-10 hours', 'More than 10 hours'],
  },
  {
    id: 4,
    question: 'How confident are you in your current ad campaigns\' ROI (Return on Investment)?',
    options: ['Very confident', 'Somewhat confident', 'Not very confident', 'Not confident at all'],
  },
  {
    id: 5,
    question: 'How much of your website traffic comes from organic search (SEO)?',
    options: ['Less than 25%', '25-50%', '50-75%', 'More than 75%'],
  },
  {
    id: 6,
    question: 'How would you describe your brand\'s online presence?',
    options: ['Strong and well-established', 'Growing but needs improvement', 'Just getting started', 'Non-existent'],
  },
  {
    id: 7,
    question: 'How much revenue do you generate from your online marketing efforts?',
    options: [
      'Less than ₹75,000 per month (Less than $1,000)', 
      '₹75,000 - ₹3,75,000 per month ($1,000 - $5,000)', 
      '₹3,75,000 - ₹7,50,000 per month ($5,000 - $10,000)', 
      'More than ₹7,50,000 per month (More than $10,000)'
    ],
  },
];

const Survey: React.FC = () => {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Get user data from localStorage
  const userFormData = localStorage.getItem('userFormData') 
    ? JSON.parse(localStorage.getItem('userFormData') || '{}') 
    : null;

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Store survey answers in localStorage
    localStorage.setItem('surveyAnswers', JSON.stringify(answers));
    
    // Navigate to video page
    setTimeout(() => {
      navigate('/video');
    }, 1000);
  };

  // Check if all questions are answered
  const allQuestionsAnswered = questions.every(q => answers[q.id] !== undefined);

  return (
    <div className="bg-black min-h-screen flex flex-col items-center justify-start text-white relative py-12 px-4">
      {/* Background effects */}
      <FlickeringGrid 
        color="#ffffff" 
        className="absolute inset-0 z-0" 
        maxOpacity={0.15}
        flickerChance={0.1}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black/90 z-1"></div>
      
      <div className="z-10 max-w-4xl mx-auto w-full">
        <div className="mb-10 mt-4">
          <BoxReveal boxColor="#5046e6" duration={0.6}>
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 py-2">
              Digital Marketing Survey
            </h1>
          </BoxReveal>
        </div>
        
        {userFormData && (
          <div className="text-center mb-8">
            <p className="text-gray-300">
              Thank you, <span className="text-purple-400 font-semibold">{userFormData.name}</span>, for your interest in our services!
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Please complete this short survey to help us understand your needs better.
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* All survey questions */}
          {questions.map((question) => (
            <div 
              key={question.id} 
              className="bg-gray-800/80 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">
                {question.question}
              </h2>
              
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <label 
                    key={index} 
                    className={`block p-3 rounded-lg border transition-all duration-200 cursor-pointer
                      ${answers[question.id] === option 
                        ? 'bg-purple-900/50 border-purple-500' 
                        : 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'}`}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={() => handleAnswerChange(question.id, option)}
                        className="mr-3 text-purple-600 focus:ring-purple-500"
                      />
                      <span>{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
          
          {/* Submit button */}
          <div className="flex justify-center mt-8 pb-12">
            <button
              type="submit"
              disabled={!allQuestionsAnswered || isSubmitting}
              className={`px-8 py-3 rounded-xl font-medium text-lg transition-all duration-300
                ${!allQuestionsAnswered || isSubmitting
                  ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transform hover:scale-105'}`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Survey'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Survey;
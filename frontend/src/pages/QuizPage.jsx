import React, { useState, useEffect } from 'react';
import { fetchQuizzes } from '../services/api';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    fetchQuizzes().then(data => setQuizzes(data));
  }, []);

  if (quizzes.length === 0) return <div className="text-center">Loading Quizzes...</div>;

  const currentQuiz = quizzes[currentIdx];

  return (
    <div className="max-w-2xl mx-auto bg-white border rounded-lg shadow-sm p-8">
      <h2 className="text-xl font-bold text-center mb-6">Coding Quiz</h2>
      <p className="text-sm font-medium mb-4">{currentQuiz.question}</p>
      
      <div className="space-y-3">
        {currentQuiz.options.map((opt, idx) => (
          <label key={idx} className="flex items-center gap-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <input type="radio" name="quiz" />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </div>
      <button className="w-full mt-6 bg-[#1e5bb8] text-white py-2 rounded font-bold">Submit Answer</button>
    </div>
  );
};

export default QuizPage;
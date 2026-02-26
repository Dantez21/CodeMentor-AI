import React, { useState, useEffect } from 'react';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  // Tracks how many questions have been submitted for the progress bar
  const [completedQuestions, setCompletedQuestions] = useState(0);

  useEffect(() => {
    fetch("http://localhost:8000/api/quizzes")
      .then(res => res.json())
      .then(data => setQuizzes(data))
      .catch(err => console.error("Error fetching quizzes:", err));
  }, []);

  if (quizzes.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e5bb8]"></div>
      </div>
    );
  }

  const currentQuiz = quizzes[currentIdx];
  // Progress is now calculated based on answered questions (starts at 0)
  const progressPercent = (completedQuestions / quizzes.length) * 100;

  const handleAnswerSubmit = async () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuiz.answer;
    if (isCorrect) setScore(prev => prev + 1);
    
    setIsAnswered(true);
    
    // Update progress bar immediately after clicking submit
    setCompletedQuestions(prev => prev + 1);

    // Wait 1.5 seconds so user can see feedback before sliding to next
    setTimeout(async () => {
      if (currentIdx + 1 < quizzes.length) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
      } else {
        const finalScore = ((score + (isCorrect ? 1 : 0)) / quizzes.length) * 100;
        setShowResult(true);
        
        // Save to Database (Objective 4.4)
        await fetch("http://localhost:8000/api/save-score", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: finalScore }),
        });
      }
    }, 1500);
  };

  if (showResult) {
    return (
      <div className="max-w-md mx-auto bg-white border rounded-2xl shadow-xl p-8 text-center animate-in zoom-in-95 duration-500">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-2xl font-black text-slate-800">Quiz Completed!</h2>
        <p className="text-slate-500 mt-2">Final Accuracy</p>
        <div className="text-5xl font-black text-[#1e5bb8] my-4">{Math.round((score / quizzes.length) * 100)}%</div>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-[#1e5bb8] text-white py-3 rounded-xl font-bold hover:bg-[#164a96] transition-all shadow-lg active:scale-95"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-700">
      {/* Dynamic Progress Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex justify-between text-[10px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">
          <span>Question {currentIdx + 1} of {quizzes.length}</span>
          <span className="text-[#1e5bb8]">{Math.round(progressPercent)}% Earned</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div 
            className="bg-[#1e5bb8] h-full transition-all duration-700 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Quiz Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-10">
          <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
            {currentQuiz.question}
          </h3>
          
          <div className="space-y-4">
            {currentQuiz.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isCorrect = isAnswered && opt === currentQuiz.answer;
              const isWrong = isAnswered && isSelected && opt !== currentQuiz.answer;

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(opt)}
                  className={`w-full flex items-center justify-between p-5 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 ${
                    isCorrect ? "bg-emerald-50 border-emerald-500 text-emerald-700" :
                    isWrong ? "bg-red-50 border-red-500 text-red-700" :
                    isSelected ? "border-[#1e5bb8] bg-blue-50 text-[#1e5bb8] shadow-md" :
                    "border-slate-50 hover:border-slate-200 hover:bg-slate-50 text-slate-600"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs ${isSelected ? 'bg-[#1e5bb8] text-white' : 'bg-slate-100 text-slate-500'}`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {opt}
                  </span>
                  {isCorrect && <span className="text-emerald-600 font-bold">CORRECT ✓</span>}
                  {isWrong && <span className="text-red-600 font-bold">WRONG ✕</span>}
                </button>
              );
            })}
          </div>

          <button 
            onClick={handleAnswerSubmit}
            disabled={selectedOption === null || isAnswered}
            className={`w-full mt-10 py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase transition-all shadow-lg ${
              selectedOption === null || isAnswered
              ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
              : "bg-[#1e5bb8] text-white hover:bg-[#164a96] hover:-translate-y-1 active:scale-95"
            }`}
          >
            {isAnswered ? "Validating Answer..." : "Submit Answer"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
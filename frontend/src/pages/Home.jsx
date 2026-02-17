import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center py-10">
      <h2 className="text-3xl font-bold text-gray-800">Welcome to <span className="text-[#1e5bb8]">CodeMentor AI</span></h2>
      <p className="text-gray-500 mt-2">Learn. Practice. Debug.</p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <button onClick={() => navigate('/chat')} className="p-8 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
          <div className="text-green-500 text-4xl mb-4">💬</div>
          <div className="bg-[#1e5bb8] text-white py-2 px-4 rounded text-sm">Ask Coding Question</div>
        </button>

        <button onClick={() => navigate('/quiz')} className="p-8 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
          <div className="text-orange-400 text-4xl mb-4">📝</div>
          <div className="bg-orange-400 text-white py-2 px-4 rounded text-sm">Take a Coding Quiz</div>
        </button>

        <button onClick={() => navigate('/debug')} className="p-8 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
          <div className="text-blue-500 text-4xl mb-4">{"</>"}</div>
          <div className="bg-[#1e5bb8] text-white py-2 px-4 rounded text-sm">Debug Your Code</div>
        </button>
      </div>

      <div className="mt-12 bg-white p-6 border rounded-lg text-left max-w-2xl mx-auto">
        <h3 className="font-bold text-gray-700 border-b pb-2 mb-4">Your Progress</h3>
        <div className="space-y-4 text-sm">
          <p>⭐ Quiz Score: 80%</p>
          <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
             <div className="bg-green-500 h-full" style={{ width: '80%' }}></div>
          </div>
          <p>👤 Challenges Completed: 5</p>
          <p>📅 Last Activity: Quiz Session</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
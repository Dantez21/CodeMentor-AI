import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    username: "Developer",
    score: 0,
    completed: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real-time progress from the Backend SQLite DB
  useEffect(() => {
    fetch("http://localhost:8000/")
      .then(res => res.json())
      .then(data => {
        setStats({
          username: data.user || "Developer",
          score: data.score || 0,
          completed: data.completed || 0
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching stats:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 animate-in fade-in duration-1000">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">
          Welcome back, <span className="text-[#1e5bb8]">{stats.username}</span>
        </h2>
        <p className="text-slate-500 mt-3 text-lg font-medium">
          Ready to sharpen your Python skills today?
        </p>
      </div>

      {/* Main Navigation Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Chat Card */}
        <div 
          onClick={() => navigate('/chat')} 
          className="group cursor-pointer bg-white p-8 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-blue-50 text-[#1e5bb8] rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            💬
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Coding AI</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Get instant answers to your Python questions and concept explanations.
          </p>
          <div className="inline-flex items-center text-[#1e5bb8] font-black text-xs uppercase tracking-widest">
            Chat Now →
          </div>
        </div>

        {/* Quiz Card */}
        <div 
          onClick={() => navigate('/quiz')} 
          className="group cursor-pointer bg-white p-8 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Skill Quiz</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Test your knowledge with interactive coding challenges and tracking.
          </p>
          <div className="inline-flex items-center text-orange-500 font-black text-xs uppercase tracking-widest">
            Start Quiz →
          </div>
        </div>

        {/* Debug Card */}
        <div 
          onClick={() => navigate('/debug')} 
          className="group cursor-pointer bg-white p-8 border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
        >
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
            {"</>"}
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">Bug Fixer</h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Paste your broken code and let our AI suggest instant syntax fixes.
          </p>
          <div className="inline-flex items-center text-emerald-600 font-black text-xs uppercase tracking-widest">
            Repair Code →
          </div>
        </div>
      </div>

      {/* Progress Dashboard Section */}
      <div className="mt-16 bg-slate-900 rounded-[2rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex-1">
            <h3 className="text-2xl font-black mb-2 tracking-tight">Your Learning Dashboard</h3>
            <p className="text-slate-400 mb-8">Real-time statistics synced with your database.</p>
            
            <div className="space-y-8">
              {/* Quiz Progress */}
              <div>
                <div className="flex justify-between mb-3 text-xs font-bold uppercase tracking-widest">
                  <span className="text-blue-400">Average Quiz Accuracy</span>
                  <span>{Math.round(stats.score)}%</span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${stats.score}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex gap-10">
                <div>
                  <div className="text-3xl font-black text-white">{stats.completed}</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Modules Finished</div>
                </div>
                <div className="border-l border-slate-800 pl-10">
                  <div className="text-3xl font-black text-white">Python</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Language</div>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Incentive */}
          <div className="bg-slate-800/50 border border-slate-700 p-8 rounded-3xl text-center backdrop-blur-sm min-w-[200px]">
             <div className="text-4xl mb-2">🚀</div>
             <div className="text-sm font-bold">Keep Going!</div>
             <div className="text-[10px] text-slate-400 mt-1">Next milestone at 50 challenges.</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
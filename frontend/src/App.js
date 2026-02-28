import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Home';
import ChatPage from './pages/ChatPage';
import QuizPage from './pages/QuizPage';
import DebugPage from './pages/DebugPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navigation Bar */}
        <nav className="bg-[#1e5bb8] text-white p-4 shadow-md">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            
            {/* Logo Section: Responsive Fix */}
            <Link to="/" className="flex items-center gap-2 group">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <span className="bg-white text-[#1e5bb8] rounded px-2 shadow-sm">C</span>
                {/* 'hidden' hides the text on mobile.
                  'sm:inline-block' shows it on screens larger than 640px.
                */}
                <span className="hidden sm:inline-block whitespace-nowrap tracking-tight">
                  CodeMentor AI
                </span>
              </h1>
            </Link>

            {/* Navigation Links: Adjusted spacing and size for mobile */}
            <div className="flex space-x-3 md:space-x-6 text-[11px] sm:text-sm font-bold uppercase tracking-wider">
              <Link to="/" className="hover:text-blue-200 transition-colors">Dashboard</Link>
              <Link to="/chat" className="hover:text-blue-200 transition-colors">Chat</Link>
              <Link to="/quiz" className="hover:text-blue-200 transition-colors">Quiz</Link>
              <Link to="/debug" className="hover:text-blue-200 transition-colors">Debug</Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto p-4 md:p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/debug" element={<DebugPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
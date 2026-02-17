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
            <h1 className="text-xl font-bold flex items-center gap-2">
              <span className="bg-white text-[#1e5bb8] rounded px-1">C</span> CodeMentor AI
            </h1>
            <div className="space-x-6 text-sm font-medium">
              <Link to="/" className="hover:underline">Dashboard</Link>
              <Link to="/chat" className="hover:underline">Chat</Link>
              <Link to="/quiz" className="hover:underline">Quiz</Link>
              <Link to="/debug" className="hover:underline">Debug</Link>
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <main className="max-w-6xl mx-auto p-6">
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
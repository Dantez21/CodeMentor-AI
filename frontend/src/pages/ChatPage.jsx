import React, { useState } from 'react';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! How can I help you with coding today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');
    // Logic for backend API call would go here
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-lg shadow-sm flex flex-col h-[70vh]">
      <div className="p-4 border-b font-bold text-center text-gray-700">Programming Helper Chat</div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-white border' : 'bg-blue-50 text-blue-900 border border-blue-100'}`}>
              <span className="font-bold text-xs block mb-1">{m.role === 'user' ? 'User' : 'CodeMentor AI'}</span>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input 
            className="flex-1 border p-2 rounded text-sm outline-none focus:ring-1 focus:ring-blue-500" 
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSend} className="bg-[#1e5bb8] text-white px-6 py-2 rounded text-sm font-bold">Send</button>
        </div>
        <div className="flex gap-2 mt-4 text-[10px] text-blue-600 overflow-x-auto">
          <span className="font-bold text-gray-500">Quick Tips:</span>
          {['Python Loops', 'What is a Function?', 'Explain Arrays'].map(tip => (
            <button key={tip} className="border px-2 py-1 rounded bg-white whitespace-nowrap">{tip}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
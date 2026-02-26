import React, { useState, useEffect, useRef } from 'react';

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I am your CodeMentor AI. How can I help you with your Python journey today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMessage = { role: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      
      const data = await response.json();
      
      // Artificial delay to make the "AI thinking" feel real
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
        setIsTyping(false);
      }, 800);
    } catch (error) {
      console.error("Error connecting to API:", error);
      setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting to the server. Is the backend running?" }]);
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-xl shadow-md flex flex-col h-[75vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b bg-[#1e5bb8] text-white font-bold flex justify-between items-center">
        <span>Programming Helper Chat</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] uppercase tracking-wider">AI Active</span>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm ${
              m.role === 'user' 
              ? 'bg-[#1e5bb8] text-white rounded-tr-none' 
              : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
            }`}>
              <span className={`font-black text-[10px] block mb-1 uppercase tracking-widest ${m.role === 'user' ? 'text-blue-200' : 'text-[#1e5bb8]'}`}>
                {m.role === 'user' ? 'You' : 'CodeMentor AI'}
              </span>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white">
        <div className="flex gap-2">
          <input 
            className="flex-1 border border-gray-200 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#1e5bb8] transition-all" 
            placeholder="Ask a question (e.g., How do I write a list?)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={() => handleSend()} 
            disabled={isTyping}
            className="bg-[#1e5bb8] hover:bg-[#164a96] disabled:bg-gray-400 text-white px-6 py-2 rounded-xl text-sm font-bold transition-colors"
          >
            Send
          </button>
        </div>
        
        {/* Functional Quick Tips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase whitespace-nowrap">Quick Tips:</span>
          {['Python Loops', 'What is a Function?', 'Explain Lists'].map(tip => (
            <button 
              key={tip} 
              onClick={() => handleSend(tip)}
              className="text-[11px] border border-blue-100 px-3 py-1.5 rounded-full bg-blue-50 text-[#1e5bb8] hover:bg-[#1e5bb8] hover:text-white transition-all whitespace-nowrap shadow-sm"
            >
              {tip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
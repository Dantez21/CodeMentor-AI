import React, { useState, useEffect } from 'react';

const DebugPage = () => {
  const [code, setCode] = useState(`def add(a,b)\nprint(a+b)`);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  // Sync line numbers with textarea content
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineCount(lines);
  }, [code]);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/debug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      setResults({ 
        status: "error", 
        message: "Backend Offline", 
        suggestion: "Ensure your FastAPI server is running (uvicorn app.main:app --reload)" 
      });
    } finally {
      setLoading(false);
    }
  };

  // NEW: Function to automatically fix the code in the editor
  const applyFix = () => {
    if (results?.corrected_code) {
      setCode(results.corrected_code);
      setResults(null); // Clear results to show the fix was successful
    }
  };

  const clearEditor = () => {
    setCode('');
    setResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
        
        {/* Header / Toolbar */}
        <div className="bg-slate-50 border-b p-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">AI Debug Assistant</h2>
            <p className="text-xs text-slate-500 font-medium">Identify and repair Python syntax instantly</p>
          </div>
          <button 
            onClick={clearEditor}
            className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            Clear Editor
          </button>
        </div>

        {/* Editor Area with Line Numbers */}
        <div className="flex bg-[#f8fafc] min-h-[350px]">
          <div className="w-12 bg-slate-100 border-r flex flex-col items-center pt-4 text-slate-400 font-mono text-sm select-none">
            {Array.from({ length: Math.max(lineCount, 12) }).map((_, i) => (
              <div key={i} className="h-6 flex items-center">{i + 1}</div>
            ))}
          </div>

          <textarea 
            className="flex-1 p-4 font-mono text-sm bg-transparent outline-none resize-none text-slate-700 leading-6"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck="false"
            placeholder="# Paste your code here..."
          />
        </div>

        {/* Action Bar */}
        <div className="p-4 border-t bg-white flex justify-end items-center gap-4">
          {loading && <span className="text-xs text-blue-600 font-bold animate-pulse uppercase tracking-tighter">Processing...</span>}
          <button 
            onClick={analyzeCode}
            disabled={loading}
            className={`bg-[#1e5bb8] hover:bg-[#164a96] text-white px-8 py-3 rounded-lg text-sm font-black transition-all shadow-md active:scale-95 disabled:grayscale`}
          >
            RUN DEBUGGER
          </button>
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-8 space-y-4 animate-in zoom-in-95 duration-300">
          
          {/* Status Banner */}
          <div className={`p-5 rounded-xl border-l-4 shadow-sm flex items-start gap-4 ${
            results.status === "error" ? "bg-red-50 border-red-500" : "bg-emerald-50 border-emerald-500"
          }`}>
            <span className="text-2xl">{results.status === "error" ? "🛑" : "✅"}</span>
            <div>
              <h3 className={`font-black uppercase text-xs tracking-widest ${
                results.status === "error" ? "text-red-700" : "text-emerald-700"
              }`}>
                {results.status === "error" ? "Issues Detected" : "Validation Passed"}
              </h3>
              <p className={`text-sm mt-1 font-medium ${
                results.status === "error" ? "text-red-900" : "text-emerald-900"
              }`}>{results.message}</p>
            </div>
          </div>

          {/* AI Fix Panel (Only shows if there's a correction) */}
          {results.corrected_code && (
            <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-4 bg-slate-800/50 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  <h4 className="text-blue-400 font-bold text-xs uppercase tracking-widest">AI Proposed Solution</h4>
                </div>
                <button 
                  onClick={applyFix}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black px-4 py-2 rounded-md transition-all shadow-lg active:translate-y-0.5"
                >
                  APPLY FIX
                </button>
              </div>
              
              <div className="p-6">
                <p className="text-slate-400 text-sm mb-4 leading-relaxed italic">
                  "{results.suggestion}"
                </p>
                <div className="bg-black/30 border border-white/10 p-4 rounded-lg font-mono text-emerald-400 text-sm">
                  <pre className="whitespace-pre-wrap">{results.corrected_code}</pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DebugPage;
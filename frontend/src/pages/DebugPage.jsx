import React, { useState } from 'react';

const DebugPage = () => {
  const [code, setCode] = useState(`def add(a,b)\nprint(a+b)`);

  return (
    <div className="max-w-3xl mx-auto bg-white border rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-center mb-6">Debug Your Code</h2>
      
      <textarea 
        className="w-full h-40 p-4 font-mono text-sm bg-blue-50 border border-blue-100 rounded focus:outline-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button className="mt-4 bg-[#1e5bb8] text-white px-8 py-2 rounded text-sm font-bold">Analyze Code</button>

      <div className="mt-8">
        <h3 className="text-sm font-bold text-gray-700 mb-2">Results:</h3>
        <div className="p-4 bg-red-50 border border-red-100 rounded text-sm text-red-800 flex gap-2 items-start">
          <span className="font-bold">ⓘ</span> 
          <div>
            <p className="font-bold">Error Found:</p>
            <p>Function body is not indented properly.</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-gray-50 border rounded text-sm">
          <p className="font-bold text-gray-600 mb-2">Suggested Fix:</p>
          <div className="bg-white p-3 border rounded font-mono text-blue-700">
            <pre>{`def add(a,b):
                print(a+b)`}</pre>
          </div>
          <p className="mt-2 text-[12px] text-gray-500">Python functions need indentation after the definition.</p>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
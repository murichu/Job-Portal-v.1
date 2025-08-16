import React from 'react';

const Loading = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 border-4 border-gray-300 border-t-4 border-t-blue-400 rounded-full animate-spin mb-4">
        </div>
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    </div>
  );
}

export default Loading;

'use client';

import React from 'react';

interface ResultViewProps {
  originalUrl: string;
  resultUrl: string;
  onReset: () => void;
}

export default function ResultView({ originalUrl, resultUrl, onReset }: ResultViewProps) {
  // Check if resultUrl needs a data URI prefix
  const formattedResultUrl = resultUrl.startsWith('data:image') 
    ? resultUrl 
    : `data:image/jpeg;base64,${resultUrl}`;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = formattedResultUrl;
    link.download = 'reconstructed-structure.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Original Image */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center text-gray-800">Original</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
            <img 
              src={originalUrl} 
              alt="Original structure" 
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        </div>

        {/* AI Reconstruction */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-center text-gray-800">AI Reconstruction</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm relative min-h-[200px] flex items-center justify-center">
            {resultUrl ? (
              <img 
                src={formattedResultUrl} 
                alt="AI Reconstruction" 
                className="w-full h-auto object-cover max-h-[400px]"
                onError={(e) => {
                  console.error("Image failed to load:", resultUrl.substring(0, 50) + '...');
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<p class="text-red-500 p-4">Image format error. Check console.</p>';
                }}
              />
            ) : (
              <p className="text-gray-400">No image data</p>
            )}
          </div>
        </div>
        
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500 mb-6 italic">
          AI-generated reconstruction for visualization purposes. It represents a plausible reconstruction and may not reflect the structure's exact historical appearance.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDownload}
            className="px-6 py-2.5 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Download Reconstruction
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2.5 bg-white text-gray-700 font-medium rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
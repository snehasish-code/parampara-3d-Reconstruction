'use client';

import React, { useState, useRef } from 'react';

// এখানে আগের মতো onSuccess রাখা হলো, যাতে page.tsx এর সাথে ম্যাচ করে
interface ImageUploaderProps {
  onSuccess: (original: string, resultUrl: string) => void;
}

export default function ImageUploader({ onSuccess }: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [structureType, setStructureType] = useState('Temple');
  const [context, setContext] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsProcessing(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('structureType', structureType);
      if (context) {
         formData.append('context', context);
      }

      // API Call
      const response = await fetch('/ai-reconstruct', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
         // API থেকে রেসপন্স এলে onSuccess কল হবে
         onSuccess(previewUrl!, data.image);
      } else {
         console.error('API Error:', data.error);
         alert(data.error || 'Failed to generate reconstruction');
      }
    } catch (error) {
       console.error('Fetch error:', error);
       alert('An error occurred during reconstruction.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      
      {/* Upload Area */}
      <div 
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${previewUrl ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400'}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative inline-block">
            <img src={previewUrl} alt="Preview" className="max-h-64 rounded shadow-sm" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 mb-2">Upload a damaged structure</p>
            <label className="cursor-pointer bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors inline-block">
              Choose Image
              <input
                type="file"
                className="hidden"
                accept="image/jpeg, image/png, image/webp"
                onChange={handleFileChange}
                ref={fileInputRef}
              />
            </label>
            <p className="text-gray-400 text-xs mt-3">Supported: JPG, JPEG, PNG, WEBP<br/>Maximum size: 10 MB</p>
          </div>
        )}
      </div>

      {/* Structure Type Select */}
      <div className="space-y-1">
        <label htmlFor="structureType" className="block text-sm font-medium text-gray-700">
          Structure type
        </label>
        <select
          id="structureType"
          value={structureType}
          onChange={(e) => setStructureType(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-black bg-white focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        >
          <option value="Temple">Temple</option>
          <option value="Monument">Monument</option>
          <option value="Building">Building</option>
          <option value="Statue">Statue</option>
          <option value="Bridge">Bridge</option>
        </select>
      </div>

      {/* Additional Information Textarea */}
      <div className="space-y-1">
        <label htmlFor="context" className="block text-sm font-medium text-gray-700">
          Additional information (optional)
        </label>
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Example: This is a sandstone sculpture from a medieval Indian temple. The head and right arm are missing."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-md shadow-sm text-black bg-white focus:ring-indigo-500 focus:border-indigo-500 outline-none placeholder-gray-400"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!selectedFile || isProcessing}
        className={`w-full py-3 rounded-md text-white font-medium transition-colors ${
          !selectedFile || isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-500 hover:bg-gray-600'
        }`}
      >
        {isProcessing ? 'Reconstructing...' : 'Reconstruct'}
      </button>
    </form>
  );
}
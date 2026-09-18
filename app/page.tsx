'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ImageUploader';
import ResultView from '@/components/ResultView';

export default function Home() {
  const [result, setResult] = useState<{ original: string; result: string } | null>(null);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">ReStorAI</h1>
          <p className="mt-3 text-lg text-gray-500">AI-Assisted Historical Reconstruction</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          {!result ? (
            <ImageUploader onSuccess={(original, resultUrl) => setResult({ original, result: resultUrl })} />
          ) : (
            <ResultView
              originalUrl={result.original}
              resultUrl={result.result}
              onReset={() => setResult(null)}
            />
          )}
        </div>
      </div>
    </main>
  );
}
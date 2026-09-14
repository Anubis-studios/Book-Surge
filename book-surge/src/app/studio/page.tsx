'use client';
import { useState } from 'react';
import { generateSudoku } from '@/lib/plugins/sudoku';
import { generateWordSearch } from '@/lib/plugins/wordsearch';
import { generateCrossword } from '@/lib/plugins/crossword';
import { generateMaze } from '@/lib/plugins/maze';
import { generateKakuro } from '@/lib/plugins/kakuro';

export default function Studio() {
  const [pages, setPages] = useState<any[]>([{ type: 'text', content: 'Page 1' }]);
  const [aiContent, setAiContent] = useState('');
  
  const addPage = (type: string, data: any = {}) => {
    setPages([...pages, { type, ...data }]);
  };
  
  const generateAIContent = async () => {
    const res = await fetch('/functions/v1/generate-ebook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'mindfulness journal', type: 'introduction' })
    });
    const data = await res.json();
    setAiContent(data.content);
    addPage('text', { content: data.content });
  };
  
  const exportPDF = async () => {
    const res = await fetch('/functions/v1/render-multi-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pages,
        metadata: { trimWidth: 6, trimHeight: 9, bleed: 0.125, margin: 0.5 }
      })
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'book-surge-complete.pdf'; a.click();
  };
  
  const exportEbook = async () => {
    alert('E-book export uses free Hugging Face models. Enable HF_TOKEN in Supabase env vars.');
  };
  
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Book⚡Surge Studio Pro</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">AI Content Generator (Free Models)</h2>
        <button 
          onClick={generateAIContent}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Generate AI Introduction
        </button>
        {aiContent && <div className="mt-2 p-4 bg-gray-100 rounded">{aiContent.substring(0, 200)}...</div>}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <button onClick={() => addPage('text', { content: 'New Text Page' })} className="p-2 bg-blue-100 rounded">Text</button>
        <button onClick={() => addPage('puzzle', { grid: generateSudoku('medium') })} className="p-2 bg-green-100 rounded">Sudoku</button>
        <button onClick={() => addPage('puzzle', { grid: generateWordSearch(['BOOK','SURGE']) })} className="p-2 bg-yellow-100 rounded">Word Search</button>
        <button onClick={() => addPage('puzzle', { grid: generateCrossword(['AI','BOOK','PUBLISH']) })} className="p-2 bg-purple-100 rounded">Crossword</button>
        <button onClick={() => addPage('puzzle', { grid: generateMaze() })} className="p-2 bg-pink-100 rounded">Maze</button>
      </div>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Book Pages ({pages.length})</h2>
        <div className="flex flex-wrap gap-2">
          {pages.map((page, i) => (
            <div key={i} className="p-2 border rounded bg-white shadow-sm">
              {page.type === 'puzzle' ? '🧩 Puzzle' : '📄 Text'}
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex gap-4">
        <button onClick={exportPDF} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Export KDP PDF
        </button>
        <button onClick={exportEbook} className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
          Export E-book (EPUB)
        </button>
      </div>
    </div>
  );
}

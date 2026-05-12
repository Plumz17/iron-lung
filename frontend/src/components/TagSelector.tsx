/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React from 'react';

interface TagSelectorProps {
  availableTags: any[];
  selectedTagIds: number[];
  onChange: (tagId: number) => void;
}

export default function TagSelector({ availableTags, selectedTagIds, onChange }: TagSelectorProps) {
  if (!availableTags || availableTags.length === 0) {
    return <div className="text-slate-500 italic">Belum ada tag yang tersedia.</div>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {availableTags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        
        return (
          <button
            key={tag.id}
            type="button"
            onClick={() => onChange(tag.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              isSelected 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
}

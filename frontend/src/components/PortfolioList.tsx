/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React from 'react';

interface PortfolioListProps {
  portfolios: any[];
  onEdit: (portfolio: any) => void;
  onDelete: (id: number) => void;
}

export default function PortfolioList({ portfolios, onEdit, onDelete }: PortfolioListProps) {
  if (!portfolios || portfolios.length === 0) {
    return (
      <div className="text-center py-10 bg-white shadow rounded-lg">
        <p className="text-slate-500">Anda belum memiliki portofolio.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {portfolios.map(item => (
        <div key={item.id} className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
          {item.image_url ? (
            <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
          ) : (
            <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
              <span className="text-slate-400">Tidak ada gambar</span>
            </div>
          )}
          <div className="p-4">
            <h4 className="text-lg font-semibold text-slate-900 truncate">{item.title}</h4>
            <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description || 'Tidak ada deskripsi'}</p>
            
            {item.project_url && (
              <a href={item.project_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline mt-2 block">
                Link Proyek
              </a>
            )}

            <div className="mt-4 flex justify-between">
              <button onClick={() => onEdit(item)} className="text-sm font-medium text-blue-600">Edit</button>
              <button onClick={() => onDelete(item.id)} className="text-sm font-medium text-red-600">Hapus</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

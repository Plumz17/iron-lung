/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any, imageFile?: File) => Promise<void>;
  initialData?: any;
}

export default function PortfolioFormModal({ isOpen, onClose, onSubmit, initialData }: PortfolioFormModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setProjectUrl(initialData.project_url || '');
    } else {
      setTitle('');
      setDescription('');
      setProjectUrl('');
    }
    setImageFile(null);
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await onSubmit({ title, description, project_url: projectUrl }, imageFile || undefined);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-start justify-center min-h-screen p-4 sm:items-center">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto my-8 animate-fade-up">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900" id="modal-title">
                  {initialData ? 'Edit Portofolio' : 'Tambah Portofolio'}
                </h3>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Proyek</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="Contoh: Website E-commerce"
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Singkat</label>
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Jelaskan peran dan teknologi yang digunakan..."
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">URL Proyek / Link (Opsional)</label>
                  <input 
                    type="url" 
                    value={projectUrl}
                    onChange={(e) => setProjectUrl(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    placeholder="https://github.com/..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Gambar Portofolio (Opsional)</label>
                  {initialData?.image_url && !imageFile && (
                    <div className="mb-2 text-[11px] text-indigo-600 font-medium">Gambar sudah ada. Unggah untuk mengganti.</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all"
                  />
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button 
                type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

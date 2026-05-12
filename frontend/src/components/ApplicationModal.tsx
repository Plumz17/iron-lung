/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (coverLetter: string) => Promise<void>;
  opportunityTitle: string;
}

export default function ApplicationModal({ isOpen, onClose, onSubmit, opportunityTitle }: ApplicationModalProps) {
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (coverLetter.length < 50) {
      setError('Cover letter harus berisi minimal 50 karakter.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await onSubmit(coverLetter);
      setCoverLetter('');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat mengirim lamaran.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-auto animate-fade-up">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-bold text-slate-900">
                  Lamar Lowongan
                </h3>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-6">Peluang: <span className="font-semibold text-slate-700">{opportunityTitle}</span></p>
              
              {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200 flex gap-2">
                   <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Surat Lamaran (Cover Letter)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Ceritakan mengapa Anda cocok untuk peluang ini..."
                  className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Minimal 50 karakter.</p>
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
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Mengirim...' : 'Kirim Lamaran'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const target = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
  return target ? createPortal(modalContent, target) : null;
}

/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState } from 'react';

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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" onClick={onClose}></div>
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-bold text-slate-900 mb-2">
                Lamar Lowongan: {opportunityTitle}
              </h3>
              
              {error && (
                <div className="mt-2 p-2 text-sm text-red-500 bg-red-100 rounded">
                  {error}
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Surat Lamaran (Cover Letter)
                </label>
                <textarea
                  required
                  rows={8}
                  placeholder="Ceritakan mengapa Anda cocok untuk peluang ini..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">Minimal 50 karakter.</p>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Mengirim...' : 'Kirim Lamaran'}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

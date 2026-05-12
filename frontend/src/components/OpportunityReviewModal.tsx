/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface OpportunityReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: 'approved' | 'rejected') => Promise<void>;
  opportunity: any;
}

export default function OpportunityReviewModal({ isOpen, onClose, onSubmit, opportunity }: OpportunityReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !opportunity || !mounted) return null;

  const handleReview = async (status: 'approved' | 'rejected') => {
    setError('');
    try {
      setLoading(true);
      await onSubmit(status);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat meninjau.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto animate-fade-up">
          <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
            <div className="flex items-center justify-between mb-4 border-b pb-4">
              <h3 className="text-xl font-bold text-slate-900" id="modal-title">
                Tinjau Peluang
              </h3>
              <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {error && (
              <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Judul</p>
                <p className="text-lg font-bold text-slate-900">{opportunity.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tipe</p>
                  <p className="text-sm font-semibold text-slate-700 capitalize">{opportunity.type}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lokasi</p>
                  <p className="text-sm font-semibold text-slate-700">{opportunity.location || 'Tidak disebutkan'}</p>
                </div>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deskripsi</p>
                <div className="mt-2 p-4 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                  {opportunity.description}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-800 mb-3">Tentukan Keputusan:</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReview('approved')}
                    disabled={loading || opportunity.status === 'approved'}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-md shadow-emerald-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Setujui (Approve)
                  </button>
                  <button
                    onClick={() => handleReview('rejected')}
                    disabled={loading || opportunity.status === 'rejected'}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-lg font-bold text-sm shadow-md shadow-red-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    Tolak (Reject)
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex justify-end">
            <button 
              type="button" onClick={onClose}
              className="px-5 py-2 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const target = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
  return target ? createPortal(modalContent, target) : null;
}

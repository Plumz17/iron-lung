/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState } from 'react';

interface OpportunityReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (status: 'approved' | 'rejected') => Promise<void>;
  opportunity: any;
}

export default function OpportunityReviewModal({ isOpen, onClose, onSubmit, opportunity }: OpportunityReviewModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !opportunity) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-auto">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-xl leading-6 font-bold text-slate-900 border-b pb-4" id="modal-title">
              Tinjau Peluang
            </h3>
            
            {error && (
              <div className="mt-4 p-2 text-sm text-red-500 bg-red-100 rounded">
                {error}
              </div>
            )}

            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase">Judul</p>
                <p className="text-base font-medium text-slate-900">{opportunity.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Tipe</p>
                  <p className="text-base text-slate-900 capitalize">{opportunity.type}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Lokasi</p>
                  <p className="text-base text-slate-900">{opportunity.location || 'Tidak disebutkan'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase">Deskripsi</p>
                <div className="mt-2 p-4 bg-slate-50 rounded-md border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap">
                  {opportunity.description}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500 mb-2">Pilih Keputusan:</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleReview('approved')}
                    disabled={loading || opportunity.status === 'approved'}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                  >
                    Setujui (Approve)
                  </button>
                  <button
                    onClick={() => handleReview('rejected')}
                    disabled={loading || opportunity.status === 'rejected'}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-medium disabled:opacity-50"
                  >
                    Tolak (Reject)
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              type="button" onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-slate-700 hover:bg-slate-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

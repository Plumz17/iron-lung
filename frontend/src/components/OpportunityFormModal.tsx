/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { OpportunityData } from '@/services/opportunityService';
import { getPublicTags } from '@/services/tagService';

interface OpportunityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: OpportunityData) => Promise<void>;
  initialData?: any;
}

export default function OpportunityFormModal({ isOpen, onClose, onSubmit, initialData }: OpportunityFormModalProps) {
  const [formData, setFormData] = useState<OpportunityData>({
    title: '',
    description: '',
    type: 'internship',
    location: '',
    deadline: '',
    tag_ids: [],
  });
  
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      getPublicTags().then(res => setAvailableTags(res.data)).catch(console.error);
    }

    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        type: initialData.type,
        location: initialData.location || '',
        deadline: initialData.deadline ? initialData.deadline.substring(0, 10) : '',
        tag_ids: initialData.tags ? initialData.tags.map((t: any) => t.id) : [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: 'internship',
        location: '',
        deadline: '',
        tag_ids: [],
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.tag_ids.length === 0) {
      setError('Harap pilih setidaknya satu tag.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-start justify-center min-h-screen p-4 sm:items-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-auto my-8 animate-fade-up">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900" id="modal-title">
                  {initialData ? 'Edit Peluang' : 'Buat Peluang Baru'}
                </h3>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {initialData?.status === 'rejected' && (
                <div className="mb-6 p-3 text-sm text-amber-800 bg-amber-50 rounded-lg border border-amber-200 flex gap-2">
                  <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <span className="font-semibold">Revisi Dibutuhkan:</span> Peluang ini sebelumnya ditolak. Silakan perbaiki berdasarkan saran Admin.
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-6 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex gap-2">
                  <svg className="h-5 w-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Judul Peluang</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={handleChange} required
                    placeholder="Contoh: Magang Front-end Developer"
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tipe Peluang</label>
                  <select 
                    name="type" value={formData.type} onChange={handleChange} required
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="internship">Magang</option>
                    <option value="competition">Lomba</option>
                    <option value="training">Pelatihan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi Detail</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleChange} required rows={5}
                    placeholder="Jelaskan kualifikasi, tugas, dan benefit..."
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Lokasi</label>
                    <input 
                      type="text" name="location" value={formData.location} onChange={handleChange}
                      placeholder="Mis: Jakarta / Remote"
                      className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Batas Pendaftaran</label>
                    <input 
                      type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                      className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Pilih Tag (Kategori)</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    {availableTags.map(tag => {
                      const isSelected = formData.tag_ids.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setFormData(prev => ({ ...prev, tag_ids: prev.tag_ids.filter(id => id !== tag.id) }));
                            } else {
                              setFormData(prev => ({ ...prev, tag_ids: [...prev.tag_ids, tag.id] }));
                            }
                          }}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                            isSelected 
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200' 
                              : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                    {availableTags.length === 0 && (
                      <p className="text-xs text-slate-400 italic">Memuat kategori...</p>
                    )}
                  </div>
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
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                )}
                {loading ? 'Menyimpan...' : (initialData ? 'Simpan Perubahan' : 'Simpan & Ajukan')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' 
    ? require('react-dom').createPortal(modalContent, document.body)
    : null;
}
}

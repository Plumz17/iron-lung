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

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-xl mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-slate-900" id="modal-title">
                {initialData ? 'Edit Peluang' : 'Buat Peluang Baru'}
              </h3>
              
              {initialData?.status === 'rejected' && (
                <div className="mt-2 p-2 text-sm text-yellow-800 bg-yellow-50 rounded border border-yellow-200">
                  <span className="font-semibold">Perhatian:</span> Peluang ini sebelumnya ditolak. Silakan perbaiki berdasarkan saran Admin. Setelah disimpan, status akan kembali menjadi "Menunggu Peninjauan".
                </div>
              )}

              {error && (
                <div className="mt-2 p-2 text-sm text-red-500 bg-red-100 rounded">
                  {error}
                </div>
              )}

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">Judul Peluang</label>
                  <input 
                    type="text" name="title" value={formData.title} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700">Tipe Peluang</label>
                  <select 
                    name="type" value={formData.type} onChange={handleChange} required
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 bg-white rounded-md shadow-sm"
                  >
                    <option value="internship">Magang</option>
                    <option value="competition">Lomba</option>
                    <option value="training">Pelatihan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Deskripsi Detail</label>
                  <textarea 
                    name="description" value={formData.description} onChange={handleChange} required rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Lokasi (Opsional)</label>
                    <input 
                      type="text" name="location" value={formData.location} onChange={handleChange}
                      placeholder="Mis: Jakarta / Remote"
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">Batas Pendaftaran</label>
                    <input 
                      type="date" name="deadline" value={formData.deadline} onChange={handleChange}
                      className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">Pilih Tag (Kategori)</label>
                  <div className="mt-2 flex flex-wrap gap-2">
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
                          className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors ${
                            isSelected 
                              ? 'bg-blue-600 text-white border-blue-600' 
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan & Ajukan'}
              </button>
              <button 
                type="button" onClick={onClose}
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

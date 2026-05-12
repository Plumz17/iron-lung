/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TagSelector from '@/components/TagSelector';
import { getAvailableTags, syncStudentTags } from '@/services/tagService';

export default function OnboardingTagsPage() {
  const router = useRouter();
  const [availableTags, setAvailableTags] = useState<any[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await getAvailableTags();
        setAvailableTags(res.data);
      } catch (err) {
        console.error('Failed to load tags', err);
        setError('Gagal memuat daftar minat.');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const handleToggleTag = (tagId: number) => {
    setSelectedTagIds(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };

  const handleSubmit = async () => {
    setError('');
    
    if (selectedTagIds.length < 3) {
      setError('Anda harus memilih minimal 3 minat.');
      return;
    }

    try {
      setSubmitting(true);
      await syncStudentTags(selectedTagIds);
      
      // Setelah sukses, arahkan ke dashboard mahasiswa utama
      router.push('/dashboard/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyimpan preferensi minat.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-600">Memuat preferensi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-blue-600 px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-extrabold text-white">
              Pilih Minat Anda
            </h1>
            <p className="mt-2 text-blue-100">
              Pilih minimal 3 kategori minat agar sistem dapat memberikan rekomendasi peluang lomba dan magang yang paling relevan untuk Anda.
            </p>
          </div>
          
          <div className="px-6 py-8 sm:p-10">
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md border border-red-200">
                {error}
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-lg font-medium text-slate-900 mb-4">
                Kategori Tersedia ({selectedTagIds.length} terpilih)
              </h3>
              
              <TagSelector 
                availableTags={availableTags} 
                selectedTagIds={selectedTagIds} 
                onChange={handleToggleTag} 
              />
            </div>

            <div className="border-t border-slate-200 pt-6 flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting || selectedTagIds.length < 3}
                className="inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {submitting ? 'Menyimpan...' : 'Lanjutkan ke Dashboard'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

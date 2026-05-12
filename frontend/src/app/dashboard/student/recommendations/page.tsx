/**
 * @module  Recommendation
 * @desc    Halaman rekomendasi peluang cerdas untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getRecommendations } from '@/services/recommendationService';
import ApplicationModal from '@/components/ApplicationModal';
import { applyToOpportunity } from '@/services/applicationService';

export default function StudentRecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await getRecommendations();
      setRecommendations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = (opp: any) => {
    setSelectedOpp(opp);
    setIsModalOpen(true);
  };

  const handleApplySubmit = async (coverLetter: string) => {
    if (!selectedOpp) return;
    await applyToOpportunity(selectedOpp.id, coverLetter);
    alert('Lamaran berhasil dikirim!');
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold mb-2">Rekomendasi Khusus Untuk Anda</h1>
        <p className="text-blue-100 max-w-2xl">
          Mesin rekomendasi cerdas kami mencocokkan peluang karir berdasarkan tag minat yang Anda pilih saat masa orientasi. Semakin banyak tag yang beririsan, semakin tinggi tingkat kecocokannya.
        </p>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-500">Menghitung probabilitas kecocokan...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((opp, idx) => (
            <div key={opp.id} className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
              <div className="p-6 flex-grow">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-slate-100 text-slate-800 uppercase tracking-wider">
                    {opp.type}
                  </span>
                  
                  {/* Indikator Kecocokan AI */}
                  {opp.match_score > 0 ? (
                    <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      <span>Cocok {opp.match_score} Minat</span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400 font-medium px-3 py-1 bg-slate-50 rounded-full">
                      Peluang Umum
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">{opp.title}</h3>
                <p className="text-sm font-medium text-blue-600 mb-4">{opp.user.email} • {opp.location || 'Remote/TBA'}</p>
                <p className="text-slate-600 text-sm line-clamp-3 mb-4">
                  {opp.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {opp.tags?.map((t: any) => (
                    <span key={t.id} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded border border-indigo-100">
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-between items-center mt-auto">
                <span className="text-xs font-medium text-slate-500">
                  {opp.deadline ? `Batas Waktu: ${new Date(opp.deadline).toLocaleDateString('id-ID')}` : 'Tanpa Batas Waktu'}
                </span>
                <button 
                  onClick={() => handleApplyClick(opp)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Lamar Cepat
                </button>
              </div>
            </div>
          ))}
          
          {recommendations.length === 0 && (
            <div className="col-span-full py-16 text-center">
              <svg className="mx-auto h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-slate-900">Belum Ada Rekomendasi</h3>
              <p className="mt-1 text-sm text-slate-500">Peluang magang/lomba baru akan muncul di sini. Cobalah melengkapi profil dan minat Anda.</p>
              <div className="mt-6">
                <Link href="/dashboard/student/opportunities" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Lihat Semua Peluang
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      <ApplicationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleApplySubmit}
        opportunityTitle={selectedOpp?.title || ''}
      />
    </div>
  );
}

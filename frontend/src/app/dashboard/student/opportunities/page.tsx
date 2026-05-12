/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import ApplicationModal from '@/components/ApplicationModal';
import { getAvailableOpportunities, applyToOpportunity } from '@/services/applicationService';

export default function StudentOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const res = await getAvailableOpportunities();
      setOpportunities(res.data);
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
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Eksplorasi Peluang</h1>
      
      {loading ? (
        <p>Memuat lowongan...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map(opp => (
            <div key={opp.id} className="bg-white p-6 rounded-lg shadow-md border border-slate-200 flex flex-col">
              <div className="mb-4">
                <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize mb-2">
                  {opp.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 line-clamp-2">{opp.title}</h3>
                <p className="text-sm text-slate-500 mt-1">{opp.user.email} • {opp.location || 'Lokasi tidak disebutkan'}</p>
              </div>
              <p className="text-slate-700 text-sm mb-6 line-clamp-3 flex-grow">
                {opp.description}
              </p>
              <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-red-500 font-medium">
                  {opp.deadline ? `Ditutup: ${new Date(opp.deadline).toLocaleDateString()}` : 'Tanpa Batas Waktu'}
                </span>
                <button 
                  onClick={() => handleApplyClick(opp)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Lamar Sekarang
                </button>
              </div>
            </div>
          ))}
          {opportunities.length === 0 && (
            <div className="col-span-full py-10 text-center text-slate-500">
              Belum ada lowongan yang disetujui saat ini.
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

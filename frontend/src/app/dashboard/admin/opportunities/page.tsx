/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import AdminOpportunityTable from '@/components/AdminOpportunityTable';
import OpportunityReviewModal from '@/components/OpportunityReviewModal';
import { getAdminOpportunities, reviewOpportunity } from '@/services/opportunityService';

export default function AdminOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await getAdminOpportunities();
      setOpportunities(res.data);
    } catch (error) {
      console.error('Failed to fetch opportunities', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const handleReviewClick = (opp: any) => {
    setSelectedOpp(opp);
    setIsModalOpen(true);
  };

  const handleReviewSubmit = async (status: 'approved' | 'rejected') => {
    if (!selectedOpp) return;
    
    await reviewOpportunity(selectedOpp.id, status);
    alert(`Peluang berhasil di-${status === 'approved' ? 'Setujui' : 'Tolak'}.`);
    fetchOpportunities();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Tinjauan Peluang (*Approval*)</h1>
          <p className="text-sm text-slate-500 mt-1">Verifikasi pengajuan magang, lomba, dan pelatihan dari para Mitra sebelum diterbitkan ke mahasiswa.</p>
        </div>

        {loading ? (
          <p className="text-center py-10">Memuat data peluang...</p>
        ) : (
          <AdminOpportunityTable 
            opportunities={opportunities} 
            onReview={handleReviewClick} 
          />
        )}
      </div>

      <OpportunityReviewModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleReviewSubmit}
        opportunity={selectedOpp}
      />
    </div>
  );
}

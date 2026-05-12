/**
 * @module  Opportunity
 * @desc    Halaman Mitra — Manajemen Peluang — Modern UI v2
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import PartnerOpportunityTable from '@/components/PartnerOpportunityTable';
import OpportunityFormModal from '@/components/OpportunityFormModal';
import { getPartnerOpportunities, createOpportunity, updateOpportunity, deleteOpportunity, OpportunityData } from '@/services/opportunityService';

export default function PartnerOpportunitiesPage() {
  const router = useRouter();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOpp, setSelectedOpp] = useState<any>(null);

  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const res = await getPartnerOpportunities();
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

  const handleCreateNew = () => {
    setSelectedOpp(null);
    setIsModalOpen(true);
  };

  const handleEdit = (opp: any) => {
    setSelectedOpp(opp);
    setIsModalOpen(true);
  };

  const handleViewApplicants = (id: number) => {
    router.push(`/dashboard/partner/opportunities/${id}/applications`);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus peluang ini?')) {
      try {
        await deleteOpportunity(id);
        fetchOpportunities();
      } catch (error) {
        alert('Gagal menghapus peluang.');
      }
    }
  };

  const handleSubmit = async (data: OpportunityData) => {
    if (selectedOpp) {
      await updateOpportunity(selectedOpp.id, data);
      alert('Peluang berhasil diperbarui dan dikirim ulang untuk ditinjau.');
    } else {
      await createOpportunity(data);
      alert('Peluang berhasil dibuat dan menunggu persetujuan Admin.');
    }
    fetchOpportunities();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Kelola Peluang</h1>
          <p className="text-sm text-slate-500 mt-0.5">Buat dan kelola program magang, lomba, atau pelatihan Anda.</p>
        </div>
        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Buat Peluang
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200/80 p-8 animate-pulse">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-14 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : (
        <PartnerOpportunityTable
          opportunities={opportunities}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewApplicants={handleViewApplicants}
        />
      )}

      <OpportunityFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedOpp}
      />
    </div>
  );
}

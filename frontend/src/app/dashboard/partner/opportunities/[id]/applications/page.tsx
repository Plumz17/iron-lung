/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ApplicantTable from '@/components/ApplicantTable';
import { getOpportunityApplicants } from '@/services/applicationService';

export default function PartnerApplicationsPage() {
  const params = useParams();
  const opportunityId = Number(params.id);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplicants = async () => {
    try {
      const res = await getOpportunityApplicants(opportunityId);
      setApplicants(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (opportunityId) {
      fetchApplicants();
    }
  }, [opportunityId]);

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Daftar Pelamar</h1>
        <p className="text-sm text-slate-500 mt-1">Kelola dan tinjau kandidat yang melamar pada peluang Anda.</p>
      </div>

      {loading ? (
        <p>Memuat data pelamar...</p>
      ) : (
        <ApplicantTable 
          applicants={applicants} 
          onReviewSuccess={fetchApplicants}
        />
      )}
    </div>
  );
}

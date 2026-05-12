/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { getMyApplications } from '@/services/applicationService';

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await getMyApplications();
      setApplications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">Terkirim</span>;
      case 'under_review': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">Sedang Ditinjau</span>;
      case 'accepted': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">Diterima</span>;
      case 'rejected': return <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">Ditolak</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Lacak Lamaran Saya</h1>
      
      {loading ? (
        <p>Memuat lamaran...</p>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-slate-200">
            {applications.map(app => (
              <li key={app.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-semibold text-blue-600 truncate">
                      {app.opportunity.title}
                    </p>
                    <div className="ml-2 flex-shrink-0 flex">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-slate-500 capitalize">
                        {app.opportunity.type}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-slate-500 sm:mt-0">
                      <p>Dikirim pada {new Date(app.created_at).toLocaleDateString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
            {applications.length === 0 && (
              <li className="px-4 py-8 text-center text-slate-500">
                Anda belum melamar ke lowongan mana pun.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState } from 'react';
import { reviewApplication } from '@/services/applicationService';

interface ApplicantTableProps {
  applicants: any[];
  onReviewSuccess: () => void;
}

export default function ApplicantTable({ applicants, onReviewSuccess }: ApplicantTableProps) {
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const handleReview = async (id: number, status: 'under_review' | 'accepted' | 'rejected') => {
    try {
      setLoadingId(id);
      await reviewApplication(id, status);
      onReviewSuccess();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal mengubah status.');
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Baru</span>;
      case 'under_review': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Sedang Ditinjau</span>;
      case 'accepted': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Diterima</span>;
      case 'rejected': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
      default: return null;
    }
  };

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900">Kandidat</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Cover Letter</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Dokumen</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="relative py-3.5 pl-3 pr-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {applicants.map((app) => (
            <tr key={app.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                <div className="font-medium text-slate-900">{app.user?.email}</div>
                <div className="text-slate-500 text-xs mt-1">Tanggal Lamar: {new Date(app.created_at).toLocaleDateString('id-ID')}</div>
              </td>
              <td className="px-3 py-4 text-sm text-slate-500 max-w-xs">
                <div className="line-clamp-3 text-xs bg-slate-50 p-2 rounded border">{app.cover_letter}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {app.user?.student_profile?.cv_url ? (
                  <a href={app.user.student_profile.cv_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    Lihat CV
                  </a>
                ) : (
                  <span className="text-red-500 text-xs">CV Tidak Ada</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {getStatusBadge(app.status)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                {loadingId === app.id ? (
                  <span className="text-slate-400 text-xs">Menyimpan...</span>
                ) : (
                  <div className="flex flex-col space-y-2 items-end">
                    {app.status === 'pending' && (
                      <button onClick={() => handleReview(app.id, 'under_review')} className="text-blue-600 hover:text-blue-900">
                        Tandai Sedang Ditinjau
                      </button>
                    )}
                    {app.status !== 'accepted' && (
                      <button onClick={() => handleReview(app.id, 'accepted')} className="text-green-600 hover:text-green-900">
                        Terima
                      </button>
                    )}
                    {app.status !== 'rejected' && (
                      <button onClick={() => handleReview(app.id, 'rejected')} className="text-red-600 hover:text-red-900">
                        Tolak
                      </button>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
          {applicants.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-sm text-slate-500">
                Belum ada pelamar untuk lowongan ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

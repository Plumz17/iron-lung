/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React from 'react';

interface AdminOpportunityTableProps {
  opportunities: any[];
  onReview: (opp: any) => void;
}

export default function AdminOpportunityTable({ opportunities, onReview }: AdminOpportunityTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Perlu Ditinjau</span>;
      case 'approved': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Disetujui</span>;
      case 'rejected': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Ditolak</span>;
      default: return null;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'internship': return 'Magang';
      case 'competition': return 'Lomba';
      case 'training': return 'Pelatihan';
      default: return type;
    }
  };

  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Peluang</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Mitra</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {opportunities.map((opp) => (
            <tr key={opp.id} className={opp.status === 'pending' ? 'bg-yellow-50/30' : ''}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div className="font-medium text-slate-900">{opp.title}</div>
                <div className="text-slate-500 text-xs mt-1">{getTypeLabel(opp.type)} • Deadline: {opp.deadline ? new Date(opp.deadline).toLocaleDateString('id-ID') : '-'}</div>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {opp.user?.email || `User #${opp.user_id}`}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {getStatusBadge(opp.status)}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  onClick={() => onReview(opp)}
                  className="text-indigo-600 hover:text-indigo-900 font-semibold border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded"
                >
                  Tinjau
                </button>
              </td>
            </tr>
          ))}
          {opportunities.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-sm text-slate-500">
                Tidak ada peluang yang tersedia.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

/**
 * @module  Opportunity
 * @desc    Tabel Peluang Mitra — Modern UI v2
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React from 'react';

interface PartnerOpportunityTableProps {
  opportunities: any[];
  onEdit: (opp: any) => void;
  onDelete: (id: number) => void;
}

export default function PartnerOpportunityTable({ opportunities, onEdit, onDelete }: PartnerOpportunityTableProps) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-50 text-amber-700 border-amber-200',
      approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      rejected: 'bg-red-50 text-red-700 border-red-200',
    };
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      approved: 'Disetujui',
      rejected: 'Ditolak',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${styles[status] || ''}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = { internship: 'Magang', competition: 'Lomba', training: 'Pelatihan' };
    return labels[type] || type;
  };

  if (opportunities.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200/80">
        <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <h3 className="mt-3 text-sm font-semibold text-slate-700">Belum ada peluang</h3>
        <p className="mt-1 text-xs text-slate-500">Mulai dengan membuat peluang baru untuk menarik pelamar.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-100">
        <thead>
          <tr className="bg-slate-50/50">
            <th className="py-3 pl-5 pr-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Judul</th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Tipe</th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Deadline</th>
            <th className="px-3 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            <th className="py-3 pl-3 pr-5 text-right text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {opportunities.map((opp) => (
            <tr key={opp.id} className="hover:bg-slate-50/50 transition-colors duration-100">
              <td className="py-3.5 pl-5 pr-3">
                <p className="text-sm font-medium text-slate-900">{opp.title}</p>
                {opp.status === 'rejected' && (
                  <p className="text-[11px] text-red-500 mt-0.5">Revisi & ajukan ulang</p>
                )}
              </td>
              <td className="px-3 py-3.5">
                <span className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded">{getTypeLabel(opp.type)}</span>
              </td>
              <td className="px-3 py-3.5 text-sm text-slate-500">
                {opp.deadline ? new Date(opp.deadline).toLocaleDateString('id-ID') : '—'}
              </td>
              <td className="px-3 py-3.5">{getStatusBadge(opp.status)}</td>
              <td className="py-3.5 pl-3 pr-5 text-right">
                <div className="flex items-center justify-end gap-1">
                  <button
                    onClick={() => onEdit(opp)}
                    className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(opp.id)}
                    className="px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  >
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

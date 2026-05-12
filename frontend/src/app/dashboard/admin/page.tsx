/**
 * @module  Admin Dashboard
 * @desc    Dashboard Admin — Modern UI v2
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDashboardStats } from '@/services/adminDashboardService';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="h-8 w-64 bg-slate-200 rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-white border border-slate-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Pengguna',
      value: (stats?.users.total_students || 0) + (stats?.users.total_partners || 0),
      subtitle: `${stats?.users.total_students} Mahasiswa · ${stats?.users.total_partners} Mitra`,
      color: 'bg-blue-500',
      icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    },
    {
      title: 'Menunggu Review',
      value: stats?.opportunities.pending || 0,
      subtitle: stats?.opportunities.pending > 0 ? 'Perlu ditinjau segera' : 'Semua peluang ditinjau',
      color: 'bg-amber-500',
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
    },
    {
      title: 'Total Peluang',
      value: stats?.opportunities.total || 0,
      subtitle: `${stats?.applications.total || 0} lamaran masuk`,
      color: 'bg-emerald-500',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    },
    {
      title: 'Proyek Aktif',
      value: stats?.projects.total || 0,
      subtitle: 'Kolaborasi mahasiswa',
      color: 'bg-violet-500',
      icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    },
  ];

  const quickLinks = [
    { title: 'Approval Peluang', desc: 'Tinjau dan setujui peluang baru dari mitra.', href: '/dashboard/admin/opportunities', icon: '✓' },
    { title: 'Manajemen Pengguna', desc: 'Kelola akun dan hak akses pengguna.', href: '/dashboard/admin/users', icon: '👤' },
    { title: 'Kategori & Minat', desc: 'Atur taksonomi tag untuk sistem rekomendasi.', href: '/dashboard/admin/tags', icon: '🏷' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-up">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">Ringkasan aktivitas platform Iron Lung.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl border border-slate-200/80 p-5 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{card.title}</p>
                <p className="text-3xl font-bold text-slate-900 mt-1.5">{card.value}</p>
                <p className="text-xs text-slate-400 mt-1">{card.subtitle}</p>
              </div>
              <div className={`${card.color} p-2 rounded-lg`}>
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Akses Cepat</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {quickLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="group flex items-start gap-4 p-4 bg-white rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <span className="text-2xl mt-0.5">{link.icon}</span>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{link.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{link.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

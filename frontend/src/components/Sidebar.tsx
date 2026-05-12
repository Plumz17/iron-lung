/**
 * @module  UI
 * @desc    Sidebar navigasi — Modern UI v2
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  roleId: number | null;
  isOpen: boolean;
}

export default function Sidebar({ roleId, isOpen }: SidebarProps) {
  const pathname = usePathname();

  // Role IDs from RoleSeeder: Student=1, Partner=2, Admin=3
  const menuItems = [
    // Admin (role_id=3)
    { name: 'Dashboard', href: '/dashboard/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', roles: [3] },
    { name: 'Pengguna', href: '/dashboard/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', roles: [3] },
    { name: 'Approval Peluang', href: '/dashboard/admin/opportunities', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', roles: [3] },
    { name: 'Master Tag', href: '/dashboard/admin/tags', icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z', roles: [3] },

    // Student (role_id=1)
    { name: 'Rekomendasi', href: '/dashboard/student/recommendations', icon: 'M13 10V3L4 14h7v7l9-11h-7z', roles: [1] },
    { name: 'Peluang', href: '/dashboard/student/opportunities', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', roles: [1] },
    { name: 'Lamaran Saya', href: '/dashboard/student/applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4', roles: [1] },
    { name: 'Proyek', href: '/dashboard/student/projects', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', roles: [1] },
    { name: 'Profil & CV', href: '/dashboard/student/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', roles: [1] },

    // Partner (role_id=2)
    { name: 'Kelola Peluang', href: '/dashboard/partner/opportunities', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', roles: [2] },
    
    // Global
    { name: 'Notifikasi', href: '/dashboard/notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', roles: [1, 2, 3] },
  ];

  const allowedItems = menuItems.filter(item => roleId && item.roles.includes(roleId));

  const roleLabel = roleId === 1 ? 'Mahasiswa' : roleId === 2 ? 'Mitra Industri' : roleId === 3 ? 'Administrator' : '';

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } flex flex-col`}
    >
      {/* Brand */}
      <div className="flex items-center gap-3 h-16 px-5 border-b border-slate-800/60">
        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <span className="text-white text-sm font-bold tracking-wide">IRON LUNG</span>
          <p className="text-[10px] text-slate-500 leading-none mt-0.5">{roleLabel}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="space-y-0.5">
          {allowedItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard/admin' && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <svg
                  className={`flex-shrink-0 h-[18px] w-[18px] transition-colors duration-150 ${
                    isActive ? 'text-indigo-400' : 'text-slate-500'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.75}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/60">
        <p className="text-[10px] text-slate-600 text-center">Iron Lung v1.0 — 2026</p>
      </div>
    </aside>
  );
}

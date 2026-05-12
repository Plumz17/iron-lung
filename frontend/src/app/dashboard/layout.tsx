/**
 * @module  UI
 * @desc    Master Layout (Sidebar & Navbar) untuk Dashboard
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LoadingUI from '@/components/LoadingUI';
import { getMe } from '@/services/authService';
import { getAccessToken } from '@/utils/tokenHandler';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await getMe();
        if (res?.data) {
          setUser(res.data);
        } else {
          router.push('/login');
        }
      } catch (err) {
        console.error('Failed to get user session', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [router]);

  // Handle Loading State with Skeleton
  if (loading) {
    return <LoadingUI />;
  }

  // Prevent rendering if not authenticated but hasn't redirected yet
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar roleId={user.role_id} isOpen={sidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-64 transition-all duration-300">
        
        {/* Header / Navbar */}
        <Header user={user} onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

/**
 * @module  UI
 * @desc    Halaman utama dashboard (Redirect otomatis berdasarkan Role)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/services/authService';

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    const checkRoleAndRedirect = async () => {
      try {
        const res = await getMe();
        if (res?.data) {
          const roleId = res.data.role_id;
          
          if (roleId === 3) { // Admin
            router.push('/dashboard/admin');
          } else if (roleId === 1) { // Student
            router.push('/dashboard/student/opportunities');
          } else if (roleId === 2) { // Partner
            router.push('/dashboard/partner/opportunities');
          } else {
            router.push('/login');
          }
        }
      } catch (err) {
        router.push('/login');
      }
    };

    checkRoleAndRedirect();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-full">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Mengarahkan ke dasbor Anda...</p>
      </div>
    </div>
  );
}

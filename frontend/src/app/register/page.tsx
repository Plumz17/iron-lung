/**
 * @module  Auth
 * @desc    Halaman Registrasi — Modern UI
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { register } from '@/services/authService';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSubmit = async (data: any) => {
    try {
      await register(data);
      alert("Registrasi berhasil. Silakan login.");
      router.push('/login');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-violet-600 via-indigo-700 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <rect x="150" y="150" width="500" height="500" rx="20" stroke="white" strokeWidth="0.5" />
            <rect x="250" y="250" width="300" height="300" rx="12" stroke="white" strokeWidth="0.5" />
            <rect x="350" y="350" width="100" height="100" rx="8" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold text-white leading-tight">
            Bergabunglah dengan<br />
            <span className="text-indigo-300">Iron Lung</span>
          </h1>
          <p className="mt-4 text-lg text-indigo-200 max-w-md leading-relaxed">
            Bangun karir impian Anda. Temukan magang, lomba, dan kolaborasi yang tepat untuk masa depan Anda.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Buat akun baru</h2>
            <p className="mt-2 text-sm text-slate-500">
              Gratis dan hanya butuh beberapa detik.
            </p>
          </div>

          <AuthForm type="register" onSubmit={handleRegisterSubmit} />

          <p className="mt-8 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

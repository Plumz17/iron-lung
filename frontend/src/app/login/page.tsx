/**
 * @module  Auth
 * @desc    Halaman Login — Modern UI
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 2.0
 */

'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/components/AuthForm';
import { login } from '@/services/authService';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSubmit = async (data: any) => {
    try {
      await login(data);
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 800 800" fill="none">
            <circle cx="400" cy="400" r="300" stroke="white" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="200" stroke="white" strokeWidth="0.5" />
            <circle cx="400" cy="400" r="100" stroke="white" strokeWidth="0.5" />
            <line x1="100" y1="400" x2="700" y2="400" stroke="white" strokeWidth="0.5" />
            <line x1="400" y1="100" x2="400" y2="700" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16">
          <h1 className="text-4xl font-bold text-white leading-tight">
            IRON<span className="text-indigo-300">LUNG</span>
          </h1>
          <p className="mt-4 text-lg text-indigo-200 max-w-md leading-relaxed">
            Platform kolaborasi karir yang menghubungkan mahasiswa dengan dunia industri melalui magang, lomba, dan proyek nyata.
          </p>
          <div className="mt-10 flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">500+</p>
              <p className="text-xs text-indigo-300 mt-1">Mahasiswa Aktif</p>
            </div>
            <div className="w-px h-10 bg-indigo-500/50"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">50+</p>
              <p className="text-xs text-indigo-300 mt-1">Mitra Industri</p>
            </div>
            <div className="w-px h-10 bg-indigo-500/50"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white">200+</p>
              <p className="text-xs text-indigo-300 mt-1">Peluang Karir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-6 sm:px-12 lg:px-20 bg-white">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Selamat datang kembali</h2>
            <p className="mt-2 text-sm text-slate-500">
              Masuk ke akun Anda untuk melanjutkan.
            </p>
          </div>

          <AuthForm type="login" onSubmit={handleLoginSubmit} />

          <p className="mt-8 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

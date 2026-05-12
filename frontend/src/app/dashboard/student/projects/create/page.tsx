/**
 * @module  Project
 * @desc    Modul proyek kolaborasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProject } from '@/services/projectService';

export default function CreateProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ title: '', description: '', max_members: 5 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProject(formData);
      alert('Proyek berhasil dibuat!');
      router.push('/dashboard/student/projects');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal membuat proyek.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6">Buat Proyek Baru</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Judul</label>
          <input type="text" className="w-full border rounded p-2 mt-1" required
                 value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
          <textarea className="w-full border rounded p-2 mt-1" required rows={4}
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maksimal Anggota</label>
          <input type="number" className="w-full border rounded p-2 mt-1" required min="2" max="20"
                 value={formData.max_members} onChange={e => setFormData({...formData, max_members: Number(e.target.value)})} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Simpan Proyek
        </button>
      </form>
    </div>
  );
}

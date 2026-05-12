/**
 * @module  Project
 * @desc    Modul proyek kolaborasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProjects, joinProject } from '@/services/projectService';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (id: number) => {
    try {
      await joinProject(id);
      alert('Berhasil mengirim permintaan bergabung!');
      fetchProjects();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Gagal bergabung.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kolaborasi Proyek</h1>
        <Link href="/dashboard/student/projects/create" className="bg-blue-600 text-white px-4 py-2 rounded">
          Buat Proyek
        </Link>
      </div>

      {loading ? (
        <p>Memuat...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(p => (
            <div key={p.id} className="bg-white p-6 rounded-lg shadow border">
              <h3 className="font-bold text-lg">{p.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{p.owner.email}</p>
              <p className="text-gray-700 mb-4">{p.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {p.members_count} / {p.max_members} Anggota
                </span>
                <button 
                  onClick={() => handleJoin(p.id)}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                >
                  Gabung
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

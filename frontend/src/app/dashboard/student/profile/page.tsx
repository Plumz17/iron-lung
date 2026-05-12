/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import StudentProfileForm from '@/components/StudentProfileForm';
import PortfolioList from '@/components/PortfolioList';
import PortfolioFormModal from '@/components/PortfolioFormModal';
import { getProfile } from '@/services/studentProfileService';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '@/services/portfolioService';

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [portfolios, setPortfolios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<any>(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const profileRes = await getProfile();
      setProfile(profileRes.data);

      const portfoliosRes = await getPortfolios();
      setPortfolios(portfoliosRes.data);
    } catch (error) {
      console.error('Failed to fetch profile data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleCreateNew = () => {
    setSelectedPortfolio(null);
    setIsModalOpen(true);
  };

  const handleEdit = (portfolio: any) => {
    setSelectedPortfolio(portfolio);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus portofolio ini?')) {
      try {
        await deletePortfolio(id);
        fetchAllData(); // Refresh list
      } catch (error) {
        alert('Gagal menghapus portofolio.');
      }
    }
  };

  const handlePortfolioSubmit = async (data: any, imageFile?: File) => {
    if (selectedPortfolio) {
      await updatePortfolio(selectedPortfolio.id, data, imageFile);
      alert('Portofolio berhasil diperbarui.');
    } else {
      await createPortfolio(data, imageFile);
      alert('Portofolio berhasil ditambahkan.');
    }
    fetchAllData(); // Refresh list
  };

  if (loading) return <div className="p-10 text-center">Memuat profil...</div>;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Profil Saya</h1>
        
        {/* Section 1: Profil & Biodata */}
        <div className="mb-12">
          <StudentProfileForm 
            profileData={profile} 
            onProfileUpdated={fetchAllData} 
          />
        </div>

        {/* Section 2: Portofolio */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Portofolio</h2>
            <button 
              onClick={handleCreateNew}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              + Tambah Portofolio
            </button>
          </div>

          <PortfolioList 
            portfolios={portfolios} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </div>

      <PortfolioFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handlePortfolioSubmit}
        initialData={selectedPortfolio}
      />
    </div>
  );
}

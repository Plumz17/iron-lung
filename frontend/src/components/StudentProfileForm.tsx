/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useState } from 'react';
import { updateProfile, uploadCv } from '@/services/studentProfileService';

interface StudentProfileFormProps {
  profileData: any;
  onProfileUpdated: () => void;
}

export default function StudentProfileForm({ profileData, onProfileUpdated }: StudentProfileFormProps) {
  const [bio, setBio] = useState(profileData?.bio || '');
  const [skills, setSkills] = useState(profileData?.skills?.join(', ') || '');
  const [semester, setSemester] = useState(profileData?.semester || '');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateText = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = skills.split(',').map((s: string) => s.trim()).filter((s: string) => s);
      await updateProfile({
        bio,
        skills: skillsArray,
        semester: semester ? parseInt(semester) : null
      });
      alert('Biodata berhasil diperbarui.');
      onProfileUpdated();
    } catch (error) {
      alert('Gagal memperbarui biodata.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadCv = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFile) return;

    setLoading(true);
    try {
      await uploadCv(cvFile);
      alert('CV berhasil diunggah.');
      setCvFile(null);
      onProfileUpdated();
    } catch (error) {
      alert('Gagal mengunggah CV. Pastikan file berupa PDF maks 5MB.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Bio Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Informasi Dasar</h3>
        <form onSubmit={handleUpdateText} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Semester</label>
            <input 
              type="number" 
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              min="1" max="14"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Skills (Pisahkan dengan koma)</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="Java, Python, Figma"
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Bio Singkat</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <button 
            type="submit" disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Simpan Informasi
          </button>
        </form>
      </div>

      {/* CV Form */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Curriculum Vitae</h3>
        {profileData?.cv_url && (
          <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md">
            Anda sudah mengunggah CV.{' '}
            <a href={profileData.cv_url} target="_blank" rel="noreferrer" className="font-bold underline">Lihat CV</a>
          </div>
        )}
        <form onSubmit={handleUploadCv} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Unggah CV Baru (PDF)</label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
              className="mt-1 block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          <button 
            type="submit" disabled={!cvFile || loading}
            className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 disabled:opacity-50"
          >
            Unggah CV
          </button>
        </form>
      </div>
    </div>
  );
}

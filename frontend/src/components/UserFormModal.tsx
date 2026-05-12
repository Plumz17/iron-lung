/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any; // Jika null/undefined berarti mode Buat Baru
}

export default function UserFormModal({ isOpen, onClose, onSubmit, initialData }: UserFormModalProps) {
  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('1');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (initialData) {
      setEmail(initialData.email);
      setRoleId(initialData.role_id?.toString() || '1');
      setIsActive(initialData.is_active);
    } else {
      setEmail('');
      setRoleId('1');
      setIsActive(true);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen || !mounted) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      setLoading(true);
      await onSubmit({ 
        email, 
        role_id: parseInt(roleId), 
        is_active: isActive 
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto animate-fade-up">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 pt-6 pb-4 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900" id="modal-title">
                  {initialData ? 'Edit Pengguna' : 'Buat Pengguna Baru'}
                </h3>
                <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
              
              {error && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nama@email.com"
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                  <select 
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="block w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  >
                    <option value="1">Student</option>
                    <option value="2">Partner</option>
                    <option value="3">Admin</option>
                  </select>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="is_active"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-slate-700 select-none">
                    Akun Aktif
                  </label>
                </div>
                
                {!initialData && (
                  <div className="flex gap-2 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                    <svg className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-[11px] text-indigo-700 leading-relaxed font-medium">
                      Password akan di-generate secara otomatis dan user akan dipaksa untuk mengubahnya pada saat login pertama kali.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="bg-slate-50 px-6 py-4 rounded-b-xl flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button 
                type="button" onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button 
                type="submit" disabled={loading}
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const target = typeof document !== 'undefined' ? document.getElementById('modal-root') : null;
  return target ? createPortal(modalContent, target) : null;
}

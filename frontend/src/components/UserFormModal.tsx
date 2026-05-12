/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useState, useEffect } from 'react';

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
  }, [initialData, isOpen]);

  if (!isOpen) return null;

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

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="fixed inset-0 bg-black/50 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {initialData ? 'Edit Pengguna' : 'Buat Pengguna Baru'}
              </h3>
              
              {error && (
                <div className="mt-2 p-2 text-sm text-red-500 bg-red-100 rounded">
                  {error}
                </div>
              )}

              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select 
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="1">Student</option>
                    <option value="2">Partner</option>
                    <option value="3">Admin</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">
                    Akun Aktif
                  </label>
                </div>
                
                {!initialData && (
                  <p className="text-xs text-amber-600 mt-2">
                    * Password akan di-generate secara otomatis dan user akan dipaksa untuk mengubahnya pada saat login pertama kali.
                  </p>
                )}
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <button 
                type="button" 
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

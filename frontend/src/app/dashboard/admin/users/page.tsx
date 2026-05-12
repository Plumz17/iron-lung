/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import UserTable from '@/components/UserTable';
import UserFormModal from '@/components/UserFormModal';
import { getUsers, createUser, updateUser, deleteUser } from '@/services/userService';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsers();
      setUsers(res.data.data); // Asumsi pagination mengembalikan res.data.data
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(id);
        fetchUsers();
      } catch (error) {
        alert('Gagal menghapus pengguna.');
      }
    }
  };

  const handleSubmit = async (data: any) => {
    if (selectedUser) {
      // Update
      await updateUser(selectedUser.id, data);
      alert('Pengguna berhasil diperbarui.');
    } else {
      // Create
      const res = await createUser(data);
      alert(`Pengguna berhasil dibuat!\nPassword sementara: ${res.data.temporary_password}\n\nHarap salin password tersebut dan berikan kepada pengguna.`);
    }
    fetchUsers();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Manajemen Pengguna</h1>
          <button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Buat Pengguna
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10">Memuat data pengguna...</p>
        ) : (
          <UserTable 
            users={users} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      <UserFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedUser}
      />
    </div>
  );
}

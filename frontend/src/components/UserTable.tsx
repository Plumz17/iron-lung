/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React from 'react';

interface UserTableProps {
  users: any[];
  onEdit: (user: any) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">ID</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Email</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Role</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Status</th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                {user.id}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {user.role?.name || '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {user.is_active ? 'Aktif' : 'Non-aktif'}
                </span>
                {user.must_change_password && (
                  <span className="ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-amber-100 text-amber-800">
                    Perlu Ubah Password
                  </span>
                )}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  onClick={() => onEdit(user)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(user.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={5} className="py-4 text-center text-sm text-slate-500">
                Tidak ada data pengguna.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

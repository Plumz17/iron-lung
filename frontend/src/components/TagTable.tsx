/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React from 'react';

interface TagTableProps {
  tags: any[];
  onEdit: (tag: any) => void;
  onDelete: (id: number) => void;
}

export default function TagTable({ tags, onEdit, onDelete }: TagTableProps) {
  return (
    <div className="overflow-x-auto shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-slate-300">
        <thead className="bg-slate-50">
          <tr>
            <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">ID</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Nama Tag</th>
            <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Slug</th>
            <th className="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {tags.map((tag) => (
            <tr key={tag.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">
                {tag.id}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-900 font-semibold">
                {tag.name}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                {tag.slug}
              </td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <button 
                  onClick={() => onEdit(tag)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onDelete(tag.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
          {tags.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-center text-sm text-slate-500">
                Belum ada tag yang dibuat.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

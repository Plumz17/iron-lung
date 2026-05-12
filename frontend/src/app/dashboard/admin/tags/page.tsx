/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

'use client';

import React, { useEffect, useState } from 'react';
import TagTable from '@/components/TagTable';
import TagFormModal from '@/components/TagFormModal';
import { getTags, createTag, updateTag, deleteTag } from '@/services/tagService';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<any>(null);

  const fetchTags = async () => {
    try {
      setLoading(true);
      const res = await getTags();
      setTags(res.data);
    } catch (error) {
      console.error('Failed to fetch tags', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTags();
  }, []);

  const handleCreateNew = () => {
    setSelectedTag(null);
    setIsModalOpen(true);
  };

  const handleEdit = (tag: any) => {
    setSelectedTag(tag);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus tag ini? Semua mahasiswa yang memiliki tag ini akan terpengaruh.')) {
      try {
        await deleteTag(id);
        fetchTags();
      } catch (error) {
        alert('Gagal menghapus tag.');
      }
    }
  };

  const handleSubmit = async (data: { name: string }) => {
    if (selectedTag) {
      await updateTag(selectedTag.id, data);
      alert('Tag berhasil diperbarui.');
    } else {
      await createTag(data);
      alert('Tag berhasil ditambahkan.');
    }
    fetchTags();
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">Manajemen Interest Tag</h1>
          <button 
            onClick={handleCreateNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Buat Tag Baru
          </button>
        </div>

        {loading ? (
          <p className="text-center py-10">Memuat data tag...</p>
        ) : (
          <TagTable 
            tags={tags} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      <TagFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={selectedTag}
      />
    </div>
  );
}

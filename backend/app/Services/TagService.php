<?php
/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Services;

use App\Models\Tag;
use App\Models\StudentProfile;
use Illuminate\Support\Str;

class TagService
{
    public function getAllTags()
    {
        return Tag::orderBy('name')->get();
    }

    public function createTag(array $data): Tag
    {
        $data['slug'] = Str::slug($data['name']);
        return Tag::create($data);
    }

    public function updateTag(int $id, array $data): Tag
    {
        $tag = Tag::findOrFail($id);
        $data['slug'] = Str::slug($data['name']);
        $tag->update($data);
        return $tag;
    }

    public function deleteTag(int $id): void
    {
        $tag = Tag::findOrFail($id);
        $tag->delete();
    }

    public function syncStudentTags(int $userId, array $tagIds): array
    {
        // Pastikan profil mahasiswa ada
        $profile = StudentProfile::firstOrCreate(
            ['user_id' => $userId],
            ['bio' => null, 'skills' => [], 'semester' => null, 'cv_url' => null]
        );

        $profile->tags()->sync($tagIds);
        
        // Memuat ulang tags setelah sinkronisasi
        return $profile->tags()->get()->toArray();
    }
}

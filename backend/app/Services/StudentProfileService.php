<?php
/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Services;

use App\Models\StudentProfile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Exception;

class StudentProfileService
{
    /**
     * Dapatkan profil mahasiswa saat ini (yang sedang login).
     *
     * @param int $userId
     * @return StudentProfile
     */
    public function getProfileByUserId(int $userId): StudentProfile
    {
        return StudentProfile::firstOrCreate(
            ['user_id' => $userId],
            ['bio' => null, 'skills' => [], 'semester' => null, 'cv_url' => null]
        );
    }

    /**
     * Perbarui data teks profil mahasiswa.
     *
     * @param int $userId
     * @param array $data
     * @return StudentProfile
     */
    public function updateProfile(int $userId, array $data): StudentProfile
    {
        $profile = $this->getProfileByUserId($userId);
        
        // Pastikan skills diformat dengan benar jika ada
        if (isset($data['skills']) && is_string($data['skills'])) {
            $data['skills'] = json_decode($data['skills'], true);
        }

        $profile->update($data);
        return $profile;
    }

    /**
     * Unggah CV (PDF) ke storage (Cloudinary/Lokal).
     *
     * @param int $userId
     * @param UploadedFile $file
     * @return StudentProfile
     * @throws Exception
     */
    public function uploadCv(int $userId, UploadedFile $file): StudentProfile
    {
        $profile = $this->getProfileByUserId($userId);

        // Hapus CV lama jika ada
        if ($profile->cv_url) {
            // Asumsi cv_url menyimpan path relatif jika disk lokal, atau public_id jika cloudinary
            // Untuk kesederhanaan, kita coba hapus berdasarkan path
            $path = str_replace(Storage::url(''), '', $profile->cv_url);
            Storage::disk(config('filesystems.default'))->delete($path);
        }

        // Simpan file baru
        // Jika environment diset ke Cloudinary, disk 'cloudinary' akan otomatis dihandle Laravel
        $path = $file->store('cv_files', config('filesystems.default', 'public'));
        
        if (!$path) {
            throw new Exception("Gagal mengunggah file CV.");
        }

        $profile->update([
            'cv_url' => Storage::disk(config('filesystems.default', 'public'))->url($path)
        ]);

        return $profile;
    }
}

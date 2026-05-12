<?php
/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Services;

use App\Models\Application;
use App\Models\Opportunity;
use App\Models\StudentProfile;
use App\Models\User;
use App\Notifications\NewApplicantNotification;
use App\Notifications\ApplicationStatusUpdated;

class ApplicationService
{
    /**
     * Dapatkan daftar lowongan yang tersedia untuk dilamar (status approved).
     */
    public function getAvailableOpportunities()
    {
        return Opportunity::with('user:id,email')->where('status', 'approved')->orderBy('created_at', 'desc')->get();
    }

    /**
     * Dapatkan daftar lamaran milik mahasiswa tertentu.
     */
    public function getStudentApplications(int $userId)
    {
        return Application::with('opportunity')->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Dapatkan daftar pelamar pada sebuah lowongan milik mitra.
     */
    public function getApplicantsForOpportunity(int $partnerId, int $opportunityId)
    {
        $opportunity = Opportunity::findOrFail($opportunityId);
        
        // Pastikan opportunity adalah milik mitra ini
        if ($opportunity->user_id !== $partnerId) {
            throw new \Exception("Unauthorized. Ini bukan lowongan Anda.");
        }

        return Application::with(['user.studentProfile'])->where('opportunity_id', $opportunityId)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Mahasiswa melamar ke suatu lowongan.
     */
    public function applyToOpportunity(int $userId, int $opportunityId, array $data): Application
    {
        // 1. Cek apakah lowongan eksis dan terbuka
        $opportunity = Opportunity::findOrFail($opportunityId);
        if ($opportunity->status !== 'approved') {
            throw new \Exception("Peluang ini belum disetujui atau sudah ditutup.");
        }

        // 2. Cek kelengkapan profil & CV
        $profile = StudentProfile::where('user_id', $userId)->first();
        if (!$profile || !$profile->cv_url) {
            throw new \Exception("Anda harus melengkapi profil dan mengunggah CV sebelum dapat melamar.");
        }

        // 3. Cek apakah sudah pernah melamar
        $existingApp = Application::where('user_id', $userId)->where('opportunity_id', $opportunityId)->first();
        if ($existingApp) {
            throw new \Exception("Anda sudah pernah melamar untuk peluang ini.");
        }

        // 4. Buat lamaran
        $application = Application::create([
            'user_id' => $userId,
            'opportunity_id' => $opportunityId,
            'cover_letter' => $data['cover_letter'],
            'status' => 'pending'
        ]);

        // 5. Kirim notifikasi ke Mitra
        $studentUser = User::find($userId);
        $opportunity->user->notify(new NewApplicantNotification($opportunity->title, $studentUser->email));

        return $application;
    }

    /**
     * Mitra mengubah status pelamar.
     */
    public function reviewApplication(int $partnerId, int $applicationId, string $status): Application
    {
        $application = Application::with('opportunity')->findOrFail($applicationId);

        // Pastikan lamaran ini untuk lowongan milik mitra yang sedang login
        if ($application->opportunity->user_id !== $partnerId) {
            throw new \Exception("Unauthorized. Anda tidak berhak meninjau lamaran ini.");
        }

        $application->update(['status' => $status]);

        // Kirim notifikasi ke Mahasiswa
        $application->user->notify(new ApplicationStatusUpdated($application->opportunity->title, $status));

        return $application;
    }
}

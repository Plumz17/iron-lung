<?php
/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\UpdateStudentProfileRequest;
use App\Http\Requests\UploadCvRequest;
use App\Services\StudentProfileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class StudentProfileController extends Controller
{
    protected $profileService;

    public function __construct(StudentProfileService $profileService)
    {
        $this->profileService = $profileService;
    }

    /**
     * Dapatkan profil mahasiswa saat ini.
     */
    public function show(): JsonResponse
    {
        try {
            $user = auth()->user();
            $profile = $this->profileService->getProfileByUserId($user->id);

            return response()->json([
                'status' => 'success',
                'data' => $profile
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memuat profil.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update teks biodata dan skills.
     */
    public function update(UpdateStudentProfileRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $data = $request->validated();
            
            $profile = $this->profileService->updateProfile($user->id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Profil berhasil diperbarui.',
                'data' => $profile
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui profil.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Upload CV.
     */
    public function uploadCv(UploadCvRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $file = $request->file('cv_file');

            $profile = $this->profileService->uploadCv($user->id, $file);

            return response()->json([
                'status' => 'success',
                'message' => 'CV berhasil diunggah.',
                'data' => $profile
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal mengunggah CV.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}

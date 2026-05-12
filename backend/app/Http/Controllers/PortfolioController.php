<?php
/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\StorePortfolioRequest;
use App\Http\Requests\UpdatePortfolioRequest;
use App\Services\PortfolioService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class PortfolioController extends Controller
{
    protected $portfolioService;

    public function __construct(PortfolioService $portfolioService)
    {
        $this->portfolioService = $portfolioService;
    }

    /**
     * Tampilkan semua portofolio milik user.
     */
    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();
            $portfolios = $this->portfolioService->getUserPortfolios($user->id);

            return response()->json([
                'status' => 'success',
                'data' => $portfolios
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memuat portofolio.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buat portofolio baru.
     */
    public function store(StorePortfolioRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $data = $request->validated();
            $file = $request->file('image_file');

            $portfolio = $this->portfolioService->createPortfolio($user->id, $data, $file);

            return response()->json([
                'status' => 'success',
                'message' => 'Portofolio berhasil dibuat.',
                'data' => $portfolio
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal membuat portofolio.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tampilkan detail portofolio.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $portfolio = $this->portfolioService->getPortfolioById($user->id, $id);

            return response()->json([
                'status' => 'success',
                'data' => $portfolio
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Portofolio tidak ditemukan.',
                'errors' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update portofolio.
     */
    public function update(UpdatePortfolioRequest $request, int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $data = $request->validated();
            $file = $request->file('image_file');

            $portfolio = $this->portfolioService->updatePortfolio($user->id, $id, $data, $file);

            return response()->json([
                'status' => 'success',
                'message' => 'Portofolio berhasil diperbarui.',
                'data' => $portfolio
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal memperbarui portofolio.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus portofolio.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $user = auth()->user();
            $this->portfolioService->deletePortfolio($user->id, $id);

            return response()->json([
                'status' => 'success',
                'message' => 'Portofolio berhasil dihapus.',
                'data' => null
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus portofolio.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}

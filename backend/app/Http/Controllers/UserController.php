<?php
/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Services\UserService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class UserController extends Controller
{
    /**
     * @var UserService
     */
    protected $userService;

    /**
     * UserController constructor.
     *
     * @param UserService $userService
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Tampilkan daftar pengguna.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $perPage = $request->input('per_page', 10);
            $users = $this->userService->getPaginatedUsers($perPage);

            return response()->json([
                'status' => 'success',
                'data' => $users
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memuat data pengguna.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Buat pengguna baru oleh Admin.
     *
     * @param StoreUserRequest $request
     * @return JsonResponse
     */
    public function store(StoreUserRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $result = $this->userService->createUser($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Pengguna berhasil dibuat.',
                'data' => $result
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat membuat pengguna.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Tampilkan detail pengguna spesifik.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        try {
            $user = $this->userService->getUserById($id);
            return response()->json([
                'status' => 'success',
                'data' => $user
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pengguna tidak ditemukan.',
                'errors' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Memperbarui pengguna.
     *
     * @param UpdateUserRequest $request
     * @param int $id
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request, int $id): JsonResponse
    {
        try {
            $data = $request->validated();
            $user = $this->userService->updateUser($id, $data);

            return response()->json([
                'status' => 'success',
                'message' => 'Pengguna berhasil diperbarui.',
                'data' => $user
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat memperbarui pengguna.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Hapus pengguna.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $this->userService->deleteUser($id);

            return response()->json([
                'status' => 'success',
                'message' => 'Pengguna berhasil dihapus.',
                'data' => null
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Gagal menghapus pengguna.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}

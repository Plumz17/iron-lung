<?php
/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ChangePasswordRequest;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Exception;

class AuthController extends Controller
{
    /**
     * @var AuthService
     */
    protected $authService;

    /**
     * AuthController constructor.
     *
     * @param AuthService $authService
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Registrasi pengguna baru.
     *
     * @param RegisterRequest $request
     * @return JsonResponse
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $result = $this->authService->registerUser($data);

            return response()->json([
                'status' => 'success',
                'message' => 'Registrasi berhasil. Silakan login.',
                'data' => $result
            ], 201);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat registrasi.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login pengguna dan dapatkan JWT token.
     *
     * @param LoginRequest $request
     * @return JsonResponse
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();
            $result = $this->authService->loginUser($credentials);

            if (!$result) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Email atau password tidak valid.',
                    'data' => null
                ], 401);
            }

            // Set refresh token di HttpOnly Cookie
            $cookie = cookie(
                'refresh_token',
                $result['refresh_token'],
                60 * 24 * 7, // 7 hari
                '/',
                null,
                true, // Secure
                true, // HttpOnly
                false,
                'Strict' // SameSite
            );

            return response()->json([
                'status' => 'success',
                'message' => 'Login berhasil.',
                'data' => [
                    'access_token' => $result['access_token'],
                    'must_change_password' => $result['user']['must_change_password'] ?? false,
                    'user' => [
                        'id' => $result['user']['id'],
                        'email' => $result['user']['email'],
                        'role' => $result['user']['role']
                    ]
                ]
            ])->withCookie($cookie);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat login.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh access token menggunakan refresh token.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $refreshToken = $request->cookie('refresh_token');

            if (!$refreshToken) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Refresh token tidak ditemukan di cookie.',
                    'data' => null
                ], 401);
            }

            $newAccessToken = $this->authService->refreshAccessToken($refreshToken);

            if (!$newAccessToken) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Refresh token tidak valid atau kadaluarsa.',
                    'data' => null
                ], 401);
            }

            return response()->json([
                'status' => 'success',
                'message' => 'Token berhasil diperbarui.',
                'data' => [
                    'access_token' => $newAccessToken
                ]
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat refresh token.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout pengguna (invalidasi token).
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $refreshToken = $request->cookie('refresh_token');
            $this->authService->logoutUser($refreshToken);

            // Hapus cookie refresh_token
            $cookie = cookie()->forget('refresh_token');

            return response()->json([
                'status' => 'success',
                'message' => 'Logout berhasil.',
                'data' => null
            ])->withCookie($cookie);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat logout.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Memaksa pengguna untuk mengubah password.
     *
     * @param ChangePasswordRequest $request
     * @return JsonResponse
     */
    public function changePassword(ChangePasswordRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            
            // Perbarui password dan set must_change_password ke false
            $user->update([
                'password' => Hash::make($request->new_password),
                'must_change_password' => false,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Password berhasil diubah. Silakan gunakan password baru untuk aktivitas Anda.',
                'data' => null
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat mengubah password.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}

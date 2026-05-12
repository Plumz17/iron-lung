<?php
/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Services;

use App\Models\User;
use App\Models\RefreshToken;
use Illuminate\Support\Facades\Hash;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Mendaftarkan user baru ke dalam sistem.
     *
     * @param array $data Data registrasi dari request
     * @return array
     * @throws Exception
     */
    public function registerUser(array $data): array
    {
        $user = User::create([
            'role_id' => $data['role_id'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'is_active' => true, // Sesuai FR: status langsung aktif untuk MVP
        ]);

        return [
            'id' => $user->id,
            'email' => $user->email,
            'role_id' => $user->role_id
        ];
    }

    /**
     * Memproses login user dan mengembalikan tokens.
     *
     * @param array $credentials Email dan password
     * @return array|null Null jika kredensial salah
     */
    public function loginUser(array $credentials): ?array
    {
        if (!$token = JWTAuth::attempt($credentials)) {
            return null;
        }

        $user = auth()->user();

        if (!$user->is_active) {
            JWTAuth::invalidate($token);
            throw new Exception("Akun dinonaktifkan. Hubungi administrator.");
        }

        // Generate Refresh Token
        $refreshTokenStr = Str::random(60);
        $tokenHash = hash('sha256', $refreshTokenStr);

        RefreshToken::create([
            'user_id' => $user->id,
            'token_hash' => $tokenHash,
            'expires_at' => Carbon::now()->addDays(7),
        ]);

        return [
            'access_token' => $token,
            'refresh_token' => $refreshTokenStr,
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'role' => $user->role->name ?? null,
                'must_change_password' => $user->must_change_password,
            ]
        ];
    }

    /**
     * Memperbarui access token berdasarkan refresh token.
     *
     * @param string $refreshTokenStr Refresh token dari cookie
     * @return string|null Access token baru atau null jika invalid
     */
    public function refreshAccessToken(string $refreshTokenStr): ?string
    {
        $tokenHash = hash('sha256', $refreshTokenStr);
        $refreshToken = RefreshToken::where('token_hash', $tokenHash)
            ->where('expires_at', '>', Carbon::now())
            ->first();

        if (!$refreshToken) {
            return null;
        }

        $user = $refreshToken->user;
        if (!$user || !$user->is_active) {
            return null;
        }

        return JWTAuth::fromUser($user);
    }

    /**
     * Melakukan proses logout (menghapus refresh token dan invalidasi access token).
     *
     * @param string|null $refreshTokenStr Refresh token dari cookie
     * @return void
     */
    public function logoutUser(?string $refreshTokenStr): void
    {
        // Invalidasi Access Token
        try {
            JWTAuth::invalidate(JWTAuth::getToken());
        } catch (Exception $e) {
            // Abaikan jika token sudah expired atau invalid saat logout
        }

        // Hapus Refresh Token dari DB jika ada
        if ($refreshTokenStr) {
            $tokenHash = hash('sha256', $refreshTokenStr);
            RefreshToken::where('token_hash', $tokenHash)->delete();
        }
    }
}

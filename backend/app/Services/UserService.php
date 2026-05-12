<?php
/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Pagination\LengthAwarePaginator;

class UserService
{
    /**
     * Mendapatkan daftar user dengan paginasi.
     *
     * @param int $perPage
     * @return LengthAwarePaginator
     */
    public function getPaginatedUsers(int $perPage = 10): LengthAwarePaginator
    {
        return User::with('role')->paginate($perPage);
    }

    /**
     * Mengambil detail user berdasarkan ID.
     *
     * @param int $id
     * @return User
     */
    public function getUserById(int $id): User
    {
        return User::with('role')->findOrFail($id);
    }

    /**
     * Membuat pengguna baru, generate password random, 
     * dan set must_change_password = true.
     *
     * @param array $data
     * @return array Mengembalikan user dan plain text password
     */
    public function createUser(array $data): array
    {
        $temporaryPassword = Str::random(10);
        
        $user = User::create([
            'role_id' => $data['role_id'],
            'email' => $data['email'],
            'password' => Hash::make($temporaryPassword),
            'is_active' => $data['is_active'] ?? true,
            'must_change_password' => true,
        ]);

        return [
            'user' => $user,
            'temporary_password' => $temporaryPassword,
        ];
    }

    /**
     * Memperbarui data pengguna.
     *
     * @param int $id
     * @param array $data
     * @return User
     */
    public function updateUser(int $id, array $data): User
    {
        $user = User::findOrFail($id);
        $user->update($data);
        return $user;
    }

    /**
     * Menghapus data pengguna.
     *
     * @param int $id
     * @return void
     */
    public function deleteUser(int $id): void
    {
        $user = User::findOrFail($id);
        $user->delete();
    }
}

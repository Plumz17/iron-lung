<?php
/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected $studentRole;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Buat role untuk testing
        $this->studentRole = Role::create([
            'name' => 'Student',
            'description' => 'Mahasiswa'
        ]);
    }

    /**
     * Test registrasi berhasil.
     */
    public function test_user_can_register_successfully()
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'email' => 'test@student.ac.id',
            'password' => 'Password123!',
            'role_id' => $this->studentRole->id
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'data' => ['id', 'email', 'role_id']
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'test@student.ac.id'
        ]);
    }

    /**
     * Test login berhasil.
     */
    public function test_user_can_login_successfully()
    {
        $user = User::create([
            'email' => 'test2@student.ac.id',
            'password' => bcrypt('Password123!'),
            'role_id' => $this->studentRole->id,
            'is_active' => true
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test2@student.ac.id',
            'password' => 'Password123!'
        ]);

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'data' => [
                         'access_token',
                         'user'
                     ]
                 ]);
                 
        $response->assertCookie('refresh_token');
    }

    /**
     * Test login gagal karena password salah.
     */
    public function test_user_cannot_login_with_wrong_password()
    {
        $user = User::create([
            'email' => 'test3@student.ac.id',
            'password' => bcrypt('Password123!'),
            'role_id' => $this->studentRole->id,
            'is_active' => true
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'test3@student.ac.id',
            'password' => 'WrongPassword!'
        ]);

        $response->assertStatus(401)
                 ->assertJsonFragment([
                     'status' => 'error',
                     'message' => 'Email atau password tidak valid.'
                 ]);
    }
}

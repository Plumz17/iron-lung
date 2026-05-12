<?php
/**
 * @module  User Management
 * @desc    Modul pengelolaan pengguna oleh Admin (CRUD)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $studentUser;
    protected $adminRole;
    protected $studentRole;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminRole = Role::create(['name' => 'Admin']);
        $this->studentRole = Role::create(['name' => 'Student']);

        $this->adminUser = User::create([
            'role_id' => $this->adminRole->id,
            'email' => 'admin@test.com',
            'password' => bcrypt('Password123!'),
            'is_active' => true
        ]);

        $this->studentUser = User::create([
            'role_id' => $this->studentRole->id,
            'email' => 'student@test.com',
            'password' => bcrypt('Password123!'),
            'is_active' => true
        ]);
    }

    /**
     * Helper untuk mendapatkan token.
     */
    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_admin_can_get_users_list()
    {
        $response = $this->authenticate($this->adminUser)->getJson('/api/v1/users');
        $response->assertStatus(200)
                 ->assertJsonStructure(['status', 'data' => ['data']]);
    }

    public function test_student_cannot_get_users_list()
    {
        $response = $this->authenticate($this->studentUser)->getJson('/api/v1/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_create_user_and_receive_temporary_password()
    {
        $response = $this->authenticate($this->adminUser)->postJson('/api/v1/users', [
            'email' => 'newuser@test.com',
            'role_id' => $this->studentRole->id,
            'is_active' => true
        ]);

        $response->assertStatus(201)
                 ->assertJsonStructure([
                     'status',
                     'message',
                     'data' => [
                         'user' => ['id', 'email', 'must_change_password'],
                         'temporary_password'
                     ]
                 ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newuser@test.com',
            'must_change_password' => 1
        ]);
    }

    public function test_admin_can_update_user_status_and_role()
    {
        $response = $this->authenticate($this->adminUser)->putJson('/api/v1/users/' . $this->studentUser->id, [
            'is_active' => false,
            'role_id' => $this->adminRole->id
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('users', [
            'id' => $this->studentUser->id,
            'is_active' => 0,
            'role_id' => $this->adminRole->id
        ]);
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Cache;

class AdminDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $studentUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $adminRole = Role::create(['name' => 'Admin']);
        $studentRole = Role::create(['name' => 'Student']);
        Role::create(['name' => 'Partner']); // Supaya cache DB jalan normal

        $this->adminUser = User::create(['role_id' => $adminRole->id, 'email' => 'admin@test.com', 'password' => bcrypt('password'), 'is_active' => true]);
        $this->studentUser = User::create(['role_id' => $studentRole->id, 'email' => 'student@test.com', 'password' => bcrypt('password'), 'is_active' => true]);
    }

    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_admin_can_get_dashboard_stats()
    {
        // Pastikan cache bersih sebelum tes
        Cache::flush();

        $response = $this->authenticate($this->adminUser)->getJson('/api/v1/admin/dashboard/stats');

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'success')
                 ->assertJsonStructure([
                     'data' => [
                         'users' => ['total_students', 'total_partners'],
                         'opportunities' => ['pending', 'approved', 'rejected', 'total'],
                         'applications' => ['total'],
                         'projects' => ['total']
                     ]
                 ]);
                 
        // Cek bahwa setidaknya ada 1 mahasiswa (karena disetup ada 1 student)
        $this->assertEquals(1, $response->json('data.users.total_students'));
    }

    public function test_student_cannot_access_dashboard_stats()
    {
        $response = $this->authenticate($this->studentUser)->getJson('/api/v1/admin/dashboard/stats');
        $response->assertStatus(403);
    }
}

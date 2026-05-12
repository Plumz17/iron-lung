<?php
/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Portfolio;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class PortfolioTest extends TestCase
{
    use RefreshDatabase;

    protected $studentUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $role = Role::create(['name' => 'Student']);
        $this->studentUser = User::create([
            'role_id' => $role->id,
            'email' => 'student@test.com',
            'password' => bcrypt('password'),
            'is_active' => true
        ]);
    }

    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_student_can_create_portfolio_with_image()
    {
        Storage::fake('public');
        $file = UploadedFile::fake()->create('project.jpg', 100, 'image/jpeg');

        $response = $this->authenticate($this->studentUser)->postJson('/api/v1/student/portfolios', [
            'title' => 'Project Aplikasi',
            'description' => 'Aplikasi keren',
            'project_url' => 'http://example.com',
            'image_file' => $file
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Project Aplikasi');

        $this->assertDatabaseHas('portfolios', [
            'user_id' => $this->studentUser->id,
            'title' => 'Project Aplikasi'
        ]);
    }
}

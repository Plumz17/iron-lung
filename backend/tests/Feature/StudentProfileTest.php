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
use App\Models\StudentProfile;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class StudentProfileTest extends TestCase
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

    public function test_student_can_update_profile()
    {
        $response = $this->authenticate($this->studentUser)->putJson('/api/v1/student/profile', [
            'bio' => 'Saya adalah mahasiswa tekun.',
            'skills' => ['PHP', 'React'],
            'semester' => 6
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.bio', 'Saya adalah mahasiswa tekun.');

        $this->assertDatabaseHas('student_profiles', [
            'user_id' => $this->studentUser->id,
            'semester' => 6
        ]);
    }

    public function test_student_can_upload_cv()
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->create('document.pdf', 1000, 'application/pdf');

        $response = $this->authenticate($this->studentUser)->postJson('/api/v1/student/profile/cv', [
            'cv_file' => $file
        ]);

        $response->assertStatus(200);
        $this->assertNotNull($response->json('data.cv_url'));
    }
}

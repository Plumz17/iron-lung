<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Opportunity;
use App\Models\StudentProfile;
use App\Models\Application;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    protected $partnerUser;
    protected $studentUser;
    protected $opportunity;

    protected function setUp(): void
    {
        parent::setUp();
        
        $partnerRole = Role::create(['name' => 'Partner']);
        $studentRole = Role::create(['name' => 'Student']);

        $this->partnerUser = User::create(['role_id' => $partnerRole->id, 'email' => 'partner@test.com', 'password' => bcrypt('password'), 'is_active' => true]);
        $this->studentUser = User::create(['role_id' => $studentRole->id, 'email' => 'student@test.com', 'password' => bcrypt('password'), 'is_active' => true]);

        $this->opportunity = Opportunity::create([
            'user_id' => $this->partnerUser->id,
            'title' => 'Software Engineer Intern',
            'description' => 'Internship description',
            'type' => 'internship',
            'status' => 'approved' // Wajib approved agar bisa dilamar
        ]);
    }

    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_student_cannot_apply_without_cv()
    {
        // Setup profile tapi tanpa CV
        StudentProfile::create(['user_id' => $this->studentUser->id, 'bio' => 'Hello']);

        $response = $this->authenticate($this->studentUser)->postJson("/api/v1/student/opportunities/{$this->opportunity->id}/apply", [
            'cover_letter' => 'Ini adalah surat lamaran saya yang memiliki lebih dari 50 karakter agar validasi FormRequest berhasil diloloskan.'
        ]);

        $response->assertStatus(400)
                 ->assertJsonPath('message', 'Anda harus melengkapi profil dan mengunggah CV sebelum dapat melamar.');
    }

    public function test_student_can_apply_with_cv()
    {
        StudentProfile::create(['user_id' => $this->studentUser->id, 'bio' => 'Hello', 'cv_url' => 'https://example.com/cv.pdf']);

        $response = $this->authenticate($this->studentUser)->postJson("/api/v1/student/opportunities/{$this->opportunity->id}/apply", [
            'cover_letter' => 'Ini adalah surat lamaran saya yang memiliki lebih dari 50 karakter agar validasi FormRequest berhasil diloloskan.'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('status', 'success');

        $this->assertDatabaseHas('applications', [
            'user_id' => $this->studentUser->id,
            'opportunity_id' => $this->opportunity->id,
            'status' => 'pending'
        ]);
    }

    public function test_partner_can_review_application()
    {
        $application = Application::create([
            'user_id' => $this->studentUser->id,
            'opportunity_id' => $this->opportunity->id,
            'cover_letter' => 'Cover letter...',
            'status' => 'pending'
        ]);

        $response = $this->authenticate($this->partnerUser)->patchJson("/api/v1/partner/applications/{$application->id}/review", [
            'status' => 'accepted'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'accepted');
    }
}

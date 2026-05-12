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

class NotificationTest extends TestCase
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
            'description' => 'x',
            'type' => 'internship',
            'status' => 'approved'
        ]);
        
        StudentProfile::create(['user_id' => $this->studentUser->id, 'bio' => 'Hello', 'cv_url' => 'http://cv.com']);
    }

    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_partner_receives_notification_when_student_applies()
    {
        $response = $this->authenticate($this->studentUser)->postJson("/api/v1/student/opportunities/{$this->opportunity->id}/apply", [
            'cover_letter' => 'Ini adalah surat lamaran yang valid dengan lebih dari 50 karakter.'
        ]);

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->partnerUser->id,
            'type' => 'App\Notifications\NewApplicantNotification'
        ]);
    }

    public function test_user_can_fetch_notifications()
    {
        // Beri satu notifikasi ke partner
        $this->partnerUser->notify(new \App\Notifications\NewApplicantNotification('Judul', 'test@test.com'));

        $response = $this->authenticate($this->partnerUser)->getJson('/api/v1/notifications');
        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
    }

    public function test_student_receives_notification_on_status_change()
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

        $response->assertStatus(200);

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->studentUser->id,
            'type' => 'App\Notifications\ApplicationStatusUpdated'
        ]);
    }
}

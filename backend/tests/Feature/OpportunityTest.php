<?php
/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Opportunity;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class OpportunityTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
    protected $partnerUser;
    protected $studentUser;

    protected function setUp(): void
    {
        parent::setUp();
        
        $adminRole = Role::create(['name' => 'Admin']);
        $this->adminUser = User::create([
            'role_id' => $adminRole->id,
            'email' => 'admin@test.com',
            'password' => bcrypt('password'),
            'is_active' => true
        ]);

        $partnerRole = Role::create(['name' => 'Partner']);
        $this->partnerUser = User::create([
            'role_id' => $partnerRole->id,
            'email' => 'partner@test.com',
            'password' => bcrypt('password'),
            'is_active' => true
        ]);

        $studentRole = Role::create(['name' => 'Student']);
        $this->studentUser = User::create([
            'role_id' => $studentRole->id,
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

    public function test_partner_can_create_opportunity_with_pending_status()
    {
        $tag = \App\Models\Tag::create(['name' => 'Tech', 'slug' => 'tech']);

        $response = $this->authenticate($this->partnerUser)->postJson('/api/v1/partner/opportunities', [
            'title' => 'Software Engineer Intern',
            'description' => 'Internship for 3 months',
            'type' => 'internship',
            'location' => 'Jakarta',
            'deadline' => '2026-12-31',
            'tag_ids' => [$tag->id]
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'Software Engineer Intern')
                 ->assertJsonPath('data.status', 'pending');
                 
        $this->assertDatabaseHas('opportunities', [
            'title' => 'Software Engineer Intern',
            'user_id' => $this->partnerUser->id,
            'status' => 'pending'
        ]);
    }

    public function test_student_cannot_access_partner_opportunities()
    {
        $response = $this->authenticate($this->studentUser)->getJson('/api/v1/partner/opportunities');
        $response->assertStatus(403);
    }

    public function test_admin_can_review_opportunity()
    {
        $opportunity = Opportunity::create([
            'user_id' => $this->partnerUser->id,
            'title' => 'Web Dev Comp',
            'description' => 'Competition',
            'type' => 'competition',
            'status' => 'pending'
        ]);

        $response = $this->authenticate($this->adminUser)->patchJson("/api/v1/admin/opportunities/{$opportunity->id}/review", [
            'status' => 'rejected'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'rejected');
                 
        $this->assertEquals('rejected', $opportunity->fresh()->status);
    }

    public function test_partner_editing_rejected_opportunity_reverts_to_pending()
    {
        $tag = \App\Models\Tag::create(['name' => 'Tech2', 'slug' => 'tech2']);

        $opportunity = Opportunity::create([
            'user_id' => $this->partnerUser->id,
            'title' => 'Training Program',
            'description' => 'Old Desc',
            'type' => 'training',
            'status' => 'rejected'
        ]);

        $response = $this->authenticate($this->partnerUser)->putJson("/api/v1/partner/opportunities/{$opportunity->id}", [
            'title' => 'Training Program Updated',
            'description' => 'New Desc',
            'type' => 'training',
            'tag_ids' => [$tag->id]
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.status', 'pending');
                 
        $this->assertEquals('pending', $opportunity->fresh()->status);
    }
}

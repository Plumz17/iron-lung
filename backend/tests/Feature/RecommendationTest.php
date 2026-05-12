<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Opportunity;
use App\Models\StudentProfile;
use App\Models\Tag;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class RecommendationTest extends TestCase
{
    use RefreshDatabase;

    protected $studentUser;
    protected $partnerUser;
    protected $tagWeb;
    protected $tagAI;
    protected $tagDesign;

    protected function setUp(): void
    {
        parent::setUp();
        
        $studentRole = Role::create(['name' => 'Student']);
        $this->studentUser = User::create(['role_id' => $studentRole->id, 'email' => 'student@test.com', 'password' => bcrypt('password'), 'is_active' => true]);

        $partnerRole = Role::create(['name' => 'Partner']);
        $this->partnerUser = User::create(['role_id' => $partnerRole->id, 'email' => 'partner@test.com', 'password' => bcrypt('password'), 'is_active' => true]);

        $this->tagWeb = Tag::create(['name' => 'Web Dev', 'slug' => 'web-dev']);
        $this->tagAI = Tag::create(['name' => 'AI', 'slug' => 'ai']);
        $this->tagDesign = Tag::create(['name' => 'UI Design', 'slug' => 'ui-design']);
    }

    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_recommendation_sorts_by_match_score()
    {
        // 1. Setup Student tags: Web Dev & AI
        $profile = StudentProfile::create(['user_id' => $this->studentUser->id]);
        $profile->tags()->sync([$this->tagWeb->id, $this->tagAI->id]);

        // 2. Setup Opportunities
        $opp1 = Opportunity::create(['user_id' => $this->partnerUser->id, 'title' => 'Web Intern', 'description' => 'x', 'type' => 'internship', 'status' => 'approved']);
        $opp1->tags()->sync([$this->tagWeb->id]); // Match = 1

        $opp2 = Opportunity::create(['user_id' => $this->partnerUser->id, 'title' => 'Web & AI Intern', 'description' => 'x', 'type' => 'internship', 'status' => 'approved']);
        $opp2->tags()->sync([$this->tagWeb->id, $this->tagAI->id]); // Match = 2

        $opp3 = Opportunity::create(['user_id' => $this->partnerUser->id, 'title' => 'Design Intern', 'description' => 'x', 'type' => 'internship', 'status' => 'approved']);
        $opp3->tags()->sync([$this->tagDesign->id]); // Match = 0 (harusnya tidak muncul jika pakai inner join, tp skrg filter in tag)

        // 3. Test endpoint
        $response = $this->authenticate($this->studentUser)->getJson('/api/v1/student/recommendations');

        $response->assertStatus(200);
        
        // Memastikan Opp2 (Match=2) berada di indeks 0, dan Opp1 (Match=1) di indeks 1
        $this->assertEquals('Web & AI Intern', $response->json('data.0.title'));
        $this->assertEquals(2, $response->json('data.0.match_score'));
        
        $this->assertEquals('Web Intern', $response->json('data.1.title'));
        $this->assertEquals(1, $response->json('data.1.match_score'));
    }
}

<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Project;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    protected $student1;
    protected $student2;

    protected function setUp(): void
    {
        parent::setUp();
        
        $role = Role::create(['name' => 'Student']);
        $this->student1 = User::create(['role_id' => $role->id, 'email' => 's1@test.com', 'password' => bcrypt('password'), 'is_active' => true]);
        $this->student2 = User::create(['role_id' => $role->id, 'email' => 's2@test.com', 'password' => bcrypt('password'), 'is_active' => true]);
    }

    protected function authenticate(User $user)
    {
        $token = JWTAuth::fromUser($user);
        return $this->withHeader('Authorization', 'Bearer ' . $token);
    }

    public function test_student_can_create_project()
    {
        $response = $this->authenticate($this->student1)->postJson('/api/v1/student/projects', [
            'title' => 'Web App',
            'description' => 'A cool web app',
            'max_members' => 3
        ]);

        $response->assertStatus(201)->assertJsonPath('data.title', 'Web App');
    }

    public function test_student_can_join_project()
    {
        $project = Project::create([
            'user_id' => $this->student1->id,
            'title' => 'AI Project',
            'description' => 'AI stuff',
            'max_members' => 5
        ]);

        $response = $this->authenticate($this->student2)->postJson("/api/v1/student/projects/{$project->id}/join");
        $response->assertStatus(201);
    }
}

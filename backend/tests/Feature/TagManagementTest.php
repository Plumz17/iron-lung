<?php
/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Role;
use App\Models\User;
use App\Models\Tag;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;

class TagManagementTest extends TestCase
{
    use RefreshDatabase;

    protected $adminUser;
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

    public function test_admin_can_create_tag()
    {
        $response = $this->authenticate($this->adminUser)->postJson('/api/v1/tags', [
            'name' => 'Web Development'
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.name', 'Web Development')
                 ->assertJsonPath('data.slug', 'web-development');

        $this->assertDatabaseHas('tags', [
            'name' => 'Web Development'
        ]);
    }

    public function test_student_cannot_create_tag()
    {
        $response = $this->authenticate($this->studentUser)->postJson('/api/v1/tags', [
            'name' => 'Data Science'
        ]);

        $response->assertStatus(403);
    }

    public function test_admin_can_update_tag()
    {
        $tag = Tag::create(['name' => 'UI Design', 'slug' => 'ui-design']);

        $response = $this->authenticate($this->adminUser)->putJson('/api/v1/tags/' . $tag->id, [
            'name' => 'UI/UX Design'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('data.name', 'UI/UX Design')
                 ->assertJsonPath('data.slug', 'uiux-design');
    }
}

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

class StudentTagTest extends TestCase
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

    public function test_student_can_sync_tags()
    {
        $tag1 = Tag::create(['name' => 'Laravel', 'slug' => 'laravel']);
        $tag2 = Tag::create(['name' => 'React', 'slug' => 'react']);
        $tag3 = Tag::create(['name' => 'Vue', 'slug' => 'vue']);

        $response = $this->authenticate($this->studentUser)->postJson('/api/v1/student/tags', [
            'tag_ids' => [$tag1->id, $tag2->id, $tag3->id]
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('student_profile_tag', [
            'tag_id' => $tag1->id
        ]);
        
        $this->assertDatabaseHas('student_profile_tag', [
            'tag_id' => $tag3->id
        ]);
    }

    public function test_student_must_select_minimum_3_tags()
    {
        $tag1 = Tag::create(['name' => 'Laravel', 'slug' => 'laravel']);

        $response = $this->authenticate($this->studentUser)->postJson('/api/v1/student/tags', [
            'tag_ids' => [$tag1->id]
        ]);

        $response->assertStatus(422)
                 ->assertJsonValidationErrors(['tag_ids']);
    }
}

<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace Tests\Feature\Project;

use App\Models\Project;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProjectTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        Role::insert([
            ['id' => 1, 'name' => 'admin',  'label' => 'Administrator', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'user',   'label' => 'User',          'created_at' => now(), 'updated_at' => now()],
        ]);
        $this->user  = User::factory()->create(['role_id' => 3]);
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    /** @test */
    public function user_can_list_their_projects(): void
    {
        Project::factory()->count(3)->create(['user_id' => $this->user->id]);
        Project::factory()->create(); // another user's project

        $this->withToken($this->token)
             ->getJson('/api/projects')
             ->assertOk()
             ->assertJsonCount(3, 'data.items');
    }

    /** @test */
    public function user_can_create_a_project(): void
    {
        $response = $this->withToken($this->token)
             ->postJson('/api/projects', [
                 'title'         => 'My New Project',
                 'canvas_width'  => 1920,
                 'canvas_height' => 1080,
             ]);

        $response->assertStatus(201)
                 ->assertJsonPath('data.title', 'My New Project');

        $this->assertDatabaseHas('projects', ['title' => 'My New Project', 'user_id' => $this->user->id]);
    }

    /** @test */
    public function user_can_update_their_own_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $this->withToken($this->token)
             ->putJson("/api/projects/{$project->id}", ['title' => 'Updated Title'])
             ->assertOk()
             ->assertJsonPath('data.title', 'Updated Title');
    }

    /** @test */
    public function user_cannot_update_another_users_project(): void
    {
        $other   = User::factory()->create(['role_id' => 3]);
        $project = Project::factory()->create(['user_id' => $other->id]);

        $this->withToken($this->token)
             ->putJson("/api/projects/{$project->id}", ['title' => 'Hacked'])
             ->assertForbidden();
    }

    /** @test */
    public function user_can_delete_their_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id]);

        $this->withToken($this->token)
             ->deleteJson("/api/projects/{$project->id}")
             ->assertOk();

        $this->assertSoftDeleted('projects', ['id' => $project->id]);
    }

    /** @test */
    public function user_can_duplicate_a_project(): void
    {
        $project = Project::factory()->create(['user_id' => $this->user->id, 'title' => 'Original']);

        $this->withToken($this->token)
             ->postJson("/api/projects/{$project->id}/duplicate")
             ->assertStatus(201)
             ->assertJsonPath('data.title', 'Original (Copy)');
    }
}

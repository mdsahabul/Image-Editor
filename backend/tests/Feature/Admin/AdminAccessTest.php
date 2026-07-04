<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace Tests\Feature\Admin;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAccessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Role::insert([
            ['id' => 1, 'name' => 'admin', 'label' => 'Administrator', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'user',  'label' => 'User',          'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /** @test */
    public function admin_can_access_admin_stats(): void
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $token = $admin->createToken('test')->plainTextToken;

        $this->withToken($token)
             ->getJson('/api/admin/stats')
             ->assertOk()
             ->assertJsonPath('success', true)
             ->assertJsonStructure(['data' => ['total_users', 'total_projects']]);
    }

    /** @test */
    public function regular_user_cannot_access_admin_endpoints(): void
    {
        $user  = User::factory()->create(['role_id' => 3]);
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
             ->getJson('/api/admin/stats')
             ->assertForbidden();
    }

    /** @test */
    public function unauthenticated_request_cannot_access_admin(): void
    {
        $this->getJson('/api/admin/stats')->assertUnauthorized();
    }

    /** @test */
    public function admin_can_list_users(): void
    {
        $admin = User::factory()->create(['role_id' => 1]);
        User::factory()->count(5)->create(['role_id' => 3]);
        $token = $admin->createToken('test')->plainTextToken;

        $this->withToken($token)
             ->getJson('/api/admin/users')
             ->assertOk()
             ->assertJsonStructure(['data' => ['items', 'pagination']]);
    }

    /** @test */
    public function admin_can_toggle_user_active_status(): void
    {
        $admin  = User::factory()->create(['role_id' => 1]);
        $target = User::factory()->create(['role_id' => 3, 'is_active' => true]);
        $token  = $admin->createToken('test')->plainTextToken;

        $this->withToken($token)
             ->postJson("/api/admin/users/{$target->id}/toggle-active")
             ->assertOk();

        $this->assertDatabaseHas('users', ['id' => $target->id, 'is_active' => 0]);
    }
}

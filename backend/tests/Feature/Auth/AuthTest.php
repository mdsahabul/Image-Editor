<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace Tests\Feature\Auth;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        // Seed roles so FK constraint is satisfied
        Role::insert([
            ['id' => 1, 'name' => 'admin',  'label' => 'Administrator', 'created_at' => now(), 'updated_at' => now()],
            ['id' => 2, 'name' => 'editor', 'label' => 'Editor',        'created_at' => now(), 'updated_at' => now()],
            ['id' => 3, 'name' => 'user',   'label' => 'User',          'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /** @test */
    public function user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name'                  => 'Test User',
            'email'                 => 'test@example.com',
            'password'              => 'Password1',
            'password_confirmation' => 'Password1',
        ]);

        $response->assertStatus(201)
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data' => ['user', 'token']]);

        $this->assertDatabaseHas('users', ['email' => 'test@example.com']);
    }

    /** @test */
    public function user_cannot_register_with_duplicate_email(): void
    {
        User::factory()->create(['email' => 'dup@example.com']);

        $this->postJson('/api/auth/register', [
            'name'                  => 'Dup',
            'email'                 => 'dup@example.com',
            'password'              => 'Password1',
            'password_confirmation' => 'Password1',
        ])->assertStatus(422);
    }

    /** @test */
    public function user_can_login_with_correct_credentials(): void
    {
        $user = User::factory()->create(['password' => bcrypt('Password1')]);

        $response = $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'Password1',
        ]);

        $response->assertOk()
                 ->assertJsonPath('success', true)
                 ->assertJsonStructure(['data' => ['token']]);
    }

    /** @test */
    public function user_cannot_login_with_wrong_password(): void
    {
        $user = User::factory()->create(['password' => bcrypt('correct')]);

        $this->postJson('/api/auth/login', [
            'email'    => $user->email,
            'password' => 'wrong',
        ])->assertStatus(422);
    }

    /** @test */
    public function authenticated_user_can_fetch_their_profile(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
             ->getJson('/api/me')
             ->assertOk()
             ->assertJsonPath('data.email', $user->email);
    }

    /** @test */
    public function user_can_logout(): void
    {
        $user  = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        $this->withToken($token)
             ->postJson('/api/auth/logout')
             ->assertOk();

        // Token should now be revoked
        $this->withToken($token)
             ->getJson('/api/me')
             ->assertUnauthorized();
    }
}

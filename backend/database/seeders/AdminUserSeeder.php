<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => env('ADMIN_EMAIL', 'admin@image-editor.local')],
            [
                'name' => 'Md. Sahabul',
                'password' => Hash::make(env('ADMIN_PASSWORD', 'ChangeMe123!')),
                'role_id' => 1, // admin
                'email_verified_at' => now(),
                'storage_quota_mb' => 102400, // 100 GB for admin
                'is_active' => true,
            ]
        );
    }
}

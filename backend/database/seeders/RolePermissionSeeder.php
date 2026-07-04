<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $permissions = [
            'projects.create', 'projects.update', 'projects.delete', 'projects.view',
            'images.upload', 'images.delete',
            'ai.use',
            'export.create',
            'admin.users.manage',
            'admin.settings.manage',
            'admin.stats.view',
            'admin.queue.manage',
        ];

        foreach ($permissions as $name) {
            Permission::firstOrCreate(['name' => $name], ['label' => str($name)->headline()]);
        }

        $admin = Role::firstOrCreate(['name' => 'admin'], ['label' => 'Administrator']);
        $editor = Role::firstOrCreate(['name' => 'editor'], ['label' => 'Editor']);
        $user = Role::firstOrCreate(['name' => 'user'], ['label' => 'User']);

        $admin->permissions()->sync(Permission::pluck('id'));

        $editor->permissions()->sync(
            Permission::whereIn('name', [
                'projects.create', 'projects.update', 'projects.delete', 'projects.view',
                'images.upload', 'images.delete', 'ai.use', 'export.create',
            ])->pluck('id')
        );

        $user->permissions()->sync(
            Permission::whereIn('name', [
                'projects.create', 'projects.update', 'projects.delete', 'projects.view',
                'images.upload', 'images.delete', 'ai.use', 'export.create',
            ])->pluck('id')
        );
    }
}

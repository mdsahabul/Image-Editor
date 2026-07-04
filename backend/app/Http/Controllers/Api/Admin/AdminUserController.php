<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('role')->orderByDesc('created_at');

        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('role')) {
            $query->whereHas('role', fn ($q) => $q->where('name', $request->string('role')));
        }

        $users = $query->paginate($request->integer('per_page', 25));

        return $this->success([
            'items' => UserResource::collection($users->items()),
            'pagination' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    public function show(User $user)
    {
        return $this->success(new UserResource($user->load('role')));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'role_id' => ['sometimes', 'integer', 'exists:roles,id'],
            'storage_quota_mb' => ['sometimes', 'integer', 'min:1'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $user->update($validated);

        ActivityLog::record('admin.user_updated', "Admin updated user: {$user->email}");

        return $this->success(new UserResource($user->load('role')), 'User updated.');
    }

    public function destroy(Request $request, User $user)
    {
        abort_if($user->id === $request->user()->id, 422, 'You cannot delete your own account.');

        $user->delete();

        ActivityLog::record('admin.user_deleted', "Admin deleted user: {$user->email}");

        return $this->success(null, 'User deleted.');
    }

    public function toggleActive(Request $request, User $user)
    {
        abort_if($user->id === $request->user()->id, 422, 'You cannot deactivate your own account.');

        $user->update(['is_active' => ! $user->is_active]);

        ActivityLog::record('admin.user_toggle_active', "Admin toggled active state for: {$user->email}");

        return $this->success(new UserResource($user->load('role')), 'User status updated.');
    }
}

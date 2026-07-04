<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\ActivityLog;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function __invoke(RegisterRequest $request)
    {
        $defaultQuota = Setting::get('default_user_quota_mb', config('imageeditor.default_user_quota_mb', 2048));

        $user = User::create([
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'password' => Hash::make($request->validated('password')),
            'role_id' => 3, // default: user
            'storage_quota_mb' => $defaultQuota,
        ]);

        $token = $user->createToken('api-token')->plainTextToken;

        ActivityLog::record('user.registered', "New user registered: {$user->email}");

        return $this->success([
            'user' => new UserResource($user->load('role')),
            'token' => $token,
        ], 'Registration successful.', 201);
    }
}

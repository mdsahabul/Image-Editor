<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    public function __invoke(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        ActivityLog::record('user.logout', "User logged out: {$request->user()->email}");

        return $this->success(null, 'Logged out successfully.');
    }

    public function destroyAllSessions(Request $request)
    {
        $request->user()->tokens()->delete();

        ActivityLog::record('user.logout_all', "User logged out of all sessions: {$request->user()->email}");

        return $this->success(null, 'Logged out of all devices.');
    }
}

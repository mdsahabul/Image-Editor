<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use App\Models\Setting;
use Illuminate\Http\Request;

class AdminSettingController extends Controller
{
    public function index()
    {
        return $this->success([
            'default_user_quota_mb' => Setting::get('default_user_quota_mb', config('imageeditor.default_user_quota_mb')),
            'max_upload_size_mb' => Setting::get('max_upload_size_mb', config('imageeditor.max_upload_size_mb')),
            'maintenance_mode' => Setting::get('maintenance_mode', false),
            'registration_enabled' => Setting::get('registration_enabled', true),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'default_user_quota_mb' => ['sometimes', 'integer', 'min:1'],
            'max_upload_size_mb' => ['sometimes', 'integer', 'min:1', 'max:500'],
            'maintenance_mode' => ['sometimes', 'boolean'],
            'registration_enabled' => ['sometimes', 'boolean'],
        ]);

        foreach ($validated as $key => $value) {
            $type = is_bool($value) ? 'boolean' : 'integer';
            Setting::set($key, $value, $type);
        }

        ActivityLog::record('admin.settings_updated', 'Admin updated application settings.', $validated);

        return $this->success(null, 'Settings updated.');
    }
}

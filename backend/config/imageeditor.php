<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

return [
    'name' => 'Image Editor',
    'developer' => 'Md. Sahabul',
    'copyright_year' => 2026,

    'default_user_quota_mb' => (int) env('DEFAULT_USER_QUOTA_MB', 2048),
    'max_upload_size_mb' => (int) env('MAX_UPLOAD_SIZE_MB', 25),

    'allowed_image_mimes' => ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],

    'ai_service' => [
        'url' => env('AI_SERVICE_URL', 'http://127.0.0.1:8001'),
        'timeout' => (int) env('AI_SERVICE_TIMEOUT', 120),
    ],

    'export' => [
        'allowed_formats' => ['png', 'jpg', 'webp', 'pdf', 'svg'],
        'max_dimension' => 8000,
    ],
];

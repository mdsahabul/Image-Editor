<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Listeners;

use App\Events\ImageProcessed;
use App\Models\ActivityLog;

class NotifyImageProcessed
{
    public function handle(ImageProcessed $event): void
    {
        ActivityLog::create([
            'user_id' => $event->imageAsset->user_id,
            'action' => 'image.processed',
            'description' => "Image '{$event->imageAsset->original_name}' processed and ready.",
            'meta_json' => ['image_asset_id' => $event->imageAsset->id],
            'created_at' => now(),
        ]);
    }
}

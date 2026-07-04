<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Listeners;

use App\Events\ExportCompleted;
use App\Models\ActivityLog;

class NotifyExportCompleted
{
    public function handle(ExportCompleted $event): void
    {
        ActivityLog::create([
            'user_id' => $event->export->user_id,
            'action' => 'export.completed',
            'description' => "Export #{$event->export->id} ({$event->export->format}) completed.",
            'meta_json' => ['export_id' => $event->export->id],
            'created_at' => now(),
        ]);
    }
}

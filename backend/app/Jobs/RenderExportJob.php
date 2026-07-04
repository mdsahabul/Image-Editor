<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Jobs;

use App\Events\ExportCompleted;
use App\Models\Export;
use App\Services\ExportRenderService;
use App\Services\StorageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class RenderExportJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 180;

    public function __construct(protected int $exportId)
    {
    }

    public function handle(ExportRenderService $renderService, StorageService $storageService): void
    {
        $export = Export::with('project', 'user')->find($this->exportId);

        if (! $export) {
            return;
        }

        $export->update(['status' => 'processing']);

        try {
            $result = $renderService->render(
                $export->project,
                $export->format,
                $export->quality,
                $export->width,
                $export->height
            );

            $stored = $storageService->storeRaw(
                $result->binaryContents,
                $export->user,
                'exports',
                $export->format
            );

            $export->update([
                'file_path' => $stored['path'],
                'size_bytes' => $stored['size_bytes'],
                'width' => $result->width,
                'height' => $result->height,
                'status' => 'completed',
            ]);

            event(new ExportCompleted($export));
        } catch (\Throwable $e) {
            Log::error("RenderExportJob failed for Export {$this->exportId}: {$e->getMessage()}");
            $export->update(['status' => 'failed', 'error_message' => $e->getMessage()]);
        }
    }
}

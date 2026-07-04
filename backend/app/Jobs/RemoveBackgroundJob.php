<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Jobs;

use App\Models\AiJob;
use App\Services\AiInferenceClient;
use App\Services\StorageService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RemoveBackgroundJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 2;
    public int $timeout = 180;

    public function __construct(protected int $aiJobId)
    {
    }

    public function handle(AiInferenceClient $aiClient, StorageService $storageService): void
    {
        $job = AiJob::with('imageAsset.user')->find($this->aiJobId);

        if (! $job) {
            return;
        }

        $job->markProcessing();

        try {
            $asset = $job->imageAsset;
            $absolutePath = Storage::disk($asset->disk)->path($asset->original_path);

            $resultBinary = $aiClient->removeBackground($absolutePath);

            $stored = $storageService->storeRaw($resultBinary, $asset->user, 'ai-results/bg-removal', 'png');

            $job->markCompleted($stored['path']);
        } catch (\Throwable $e) {
            Log::error("RemoveBackgroundJob failed for AiJob {$this->aiJobId}: {$e->getMessage()}");
            $job->markFailed($e->getMessage());
        }
    }
}

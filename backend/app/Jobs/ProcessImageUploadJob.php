<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Jobs;

use App\Events\ImageProcessed;
use App\Models\ImageAsset;
use App\Services\ThumbnailService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ProcessImageUploadJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $tries = 3;
    public int $timeout = 120;

    public function __construct(protected int $imageAssetId)
    {
    }

    public function handle(ThumbnailService $thumbnailService): void
    {
        $asset = ImageAsset::find($this->imageAssetId);

        if (! $asset) {
            return;
        }

        try {
            $asset->update(['status' => 'processing']);

            $dimensions = $thumbnailService->dimensions($asset->original_path);
            $thumbnailPath = $thumbnailService->generate($asset->original_path, $asset->user);

            $asset->update([
                'thumbnail_path' => $thumbnailPath,
                'width' => $dimensions['width'],
                'height' => $dimensions['height'],
                'status' => 'ready',
            ]);

            event(new ImageProcessed($asset));
        } catch (\Throwable $e) {
            Log::error("ProcessImageUploadJob failed for asset {$this->imageAssetId}: {$e->getMessage()}");
            $asset->update(['status' => 'failed']);
        }
    }
}

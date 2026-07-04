<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Jobs\AutoEnhanceJob;
use App\Jobs\RemoveBackgroundJob;
use App\Jobs\UpscaleImageJob;
use App\Models\ActivityLog;
use App\Models\AiJob;
use App\Models\ImageAsset;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function removeBackground(Request $request, ImageAsset $image)
    {
        $this->authorize('view', $image);

        $job = $this->createJob($request, $image, 'bg_removal');

        RemoveBackgroundJob::dispatch($job->id);

        ActivityLog::record('ai.bg_removal_requested', "Background removal requested for: {$image->original_name}");

        return $this->success(['ai_job_id' => $job->id, 'status' => $job->status], 'Background removal queued.', 202);
    }

    public function upscale(Request $request, ImageAsset $image)
    {
        $this->authorize('view', $image);

        $validated = $request->validate(['scale' => ['nullable', 'integer', 'in:2,4']]);

        $job = $this->createJob($request, $image, 'upscale', ['scale' => $validated['scale'] ?? 2]);

        UpscaleImageJob::dispatch($job->id);

        ActivityLog::record('ai.upscale_requested', "Upscale requested for: {$image->original_name}");

        return $this->success(['ai_job_id' => $job->id, 'status' => $job->status], 'Upscale queued.', 202);
    }

    public function autoEnhance(Request $request, ImageAsset $image)
    {
        $this->authorize('view', $image);

        $job = $this->createJob($request, $image, 'auto_enhance');

        AutoEnhanceJob::dispatch($job->id);

        ActivityLog::record('ai.enhance_requested', "Auto-enhance requested for: {$image->original_name}");

        return $this->success(['ai_job_id' => $job->id, 'status' => $job->status], 'Auto-enhance queued.', 202);
    }

    public function status(Request $request, AiJob $aiJob)
    {
        abort_unless($aiJob->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        return $this->success([
            'id' => $aiJob->id,
            'type' => $aiJob->type,
            'status' => $aiJob->status,
            'result_url' => $aiJob->result_path ? \Storage::disk('public')->url($aiJob->result_path) : null,
            'error_message' => $aiJob->error_message,
        ]);
    }

    protected function createJob(Request $request, ImageAsset $image, string $type, array $params = []): AiJob
    {
        return AiJob::create([
            'user_id' => $request->user()->id,
            'image_asset_id' => $image->id,
            'type' => $type,
            'status' => 'queued',
            'params_json' => $params,
        ]);
    }
}

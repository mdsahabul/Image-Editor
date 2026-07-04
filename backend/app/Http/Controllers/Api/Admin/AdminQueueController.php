<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class AdminQueueController extends Controller
{
    public function stats()
    {
        return $this->success([
            'pending_jobs' => DB::table('jobs')->count(),
            'failed_jobs' => DB::table('failed_jobs')->count(),
            'jobs_by_queue' => DB::table('jobs')->select('queue', DB::raw('count(*) as count'))
                ->groupBy('queue')->pluck('count', 'queue'),
        ]);
    }

    public function failedJobs()
    {
        $jobs = DB::table('failed_jobs')
            ->orderByDesc('failed_at')
            ->limit(100)
            ->get(['id', 'uuid', 'queue', 'exception', 'failed_at']);

        // Trim exception text for list view; full text available via DB if needed.
        $jobs->transform(function ($job) {
            $job->exception_summary = substr($job->exception, 0, 300);
            unset($job->exception);

            return $job;
        });

        return $this->success($jobs);
    }

    public function retry(string $id)
    {
        Artisan::call('queue:retry', ['id' => [$id]]);

        return $this->success(null, 'Job re-queued for retry.');
    }

    public function forget(string $id)
    {
        Artisan::call('queue:forget', ['id' => $id]);

        return $this->success(null, 'Failed job removed.');
    }
}

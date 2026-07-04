<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AiJob;
use App\Models\Export;
use App\Models\ImageAsset;
use App\Models\Project;
use App\Models\User;
use App\Services\CacheService;
use Illuminate\Support\Facades\DB;

class AdminStatsController extends Controller
{
    public function __construct(protected CacheService $cache)
    {
    }

    public function index()
    {
        $stats = $this->cache->rememberAdminStats(function () {
            return [
                'total_users' => User::count(),
                'active_users' => User::where('is_active', true)->count(),
                'new_users_this_week' => User::where('created_at', '>=', now()->subWeek())->count(),
                'total_projects' => Project::count(),
                'total_images' => ImageAsset::count(),
                'total_storage_used_bytes' => User::sum('storage_used_bytes'),
                'total_exports' => Export::count(),
                'exports_completed' => Export::where('status', 'completed')->count(),
                'exports_failed' => Export::where('status', 'failed')->count(),
                'ai_jobs_total' => AiJob::count(),
                'ai_jobs_by_type' => AiJob::select('type', DB::raw('count(*) as count'))
                    ->groupBy('type')->pluck('count', 'type'),
                'ai_jobs_by_status' => AiJob::select('status', DB::raw('count(*) as count'))
                    ->groupBy('status')->pluck('count', 'status'),
                'signups_last_30_days' => User::where('created_at', '>=', now()->subDays(30))
                    ->selectRaw('DATE(created_at) as date, count(*) as count')
                    ->groupBy('date')->orderBy('date')->pluck('count', 'date'),
            ];
        });

        return $this->success($stats);
    }
}

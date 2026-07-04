<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Services;

use Illuminate\Support\Facades\Cache;

class CacheService
{
    protected const DEFAULT_TTL = 300; // 5 minutes

    public function rememberUserProjects(int $userId, \Closure $callback, int $ttl = self::DEFAULT_TTL)
    {
        return Cache::remember("user:{$userId}:projects", $ttl, $callback);
    }

    public function forgetUserProjects(int $userId): void
    {
        Cache::forget("user:{$userId}:projects");
    }

    public function rememberAdminStats(\Closure $callback, int $ttl = 60)
    {
        return Cache::remember('admin:stats', $ttl, $callback);
    }

    public function forgetAdminStats(): void
    {
        Cache::forget('admin:stats');
    }

    public function rememberProject(int $projectId, \Closure $callback, int $ttl = self::DEFAULT_TTL)
    {
        return Cache::remember("project:{$projectId}", $ttl, $callback);
    }

    public function forgetProject(int $projectId): void
    {
        Cache::forget("project:{$projectId}");
    }
}

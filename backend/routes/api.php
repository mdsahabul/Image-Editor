<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Auth\PasswordResetController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\FolderController;
use App\Http\Controllers\Api\ImageController;
use App\Http\Controllers\Api\LayerController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\Admin\AdminQueueController;
use App\Http\Controllers\Api\Admin\AdminSettingController;
use App\Http\Controllers\Api\Admin\AdminStatsController;
use App\Http\Controllers\Api\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Image Editor
|--------------------------------------------------------------------------
| All routes are prefixed with /api automatically by Laravel's
| RouteServiceProvider. Public auth routes are rate-limited; everything
| else requires a valid Sanctum token (auth:sanctum).
*/

Route::prefix('auth')->group(function () {
    Route::post('/register', RegisterController::class)->middleware('throttle:10,1');
    Route::post('/login', LoginController::class)->middleware('throttle:10,1');
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->middleware('throttle:5,1');
    Route::post('/reset-password', [PasswordResetController::class, 'reset'])->middleware('throttle:5,1');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', LogoutController::class);
        Route::post('/logout-all', [LogoutController::class, 'destroyAllSessions']);
    });
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [UserController::class, 'me']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/password', [UserController::class, 'updatePassword']);

    Route::get('/folders', [FolderController::class, 'index']);
    Route::post('/folders', [FolderController::class, 'store']);
    Route::put('/folders/{folder}', [FolderController::class, 'update']);
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy']);

    Route::get('/projects', [ProjectController::class, 'index']);
    Route::post('/projects', [ProjectController::class, 'store']);
    Route::get('/projects/{project}', [ProjectController::class, 'show']);
    Route::put('/projects/{project}', [ProjectController::class, 'update']);
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    Route::post('/projects/{project}/duplicate', [ProjectController::class, 'duplicate']);

    Route::get('/projects/{project}/layers', [LayerController::class, 'index']);
    Route::post('/projects/{project}/layers', [LayerController::class, 'store']);
    Route::put('/projects/{project}/layers/{layer}', [LayerController::class, 'update']);
    Route::delete('/projects/{project}/layers/{layer}', [LayerController::class, 'destroy']);
    Route::post('/projects/{project}/layers/reorder', [LayerController::class, 'reorder']);
    Route::post('/projects/{project}/versions', [LayerController::class, 'saveVersion']);
    Route::post('/projects/{project}/versions/{versionId}/restore', [LayerController::class, 'restoreVersion']);

    Route::get('/projects/{project}/exports', [ExportController::class, 'index']);
    Route::post('/projects/{project}/exports', [ExportController::class, 'store']);
    Route::get('/projects/{project}/exports/{export}', [ExportController::class, 'show']);

    Route::get('/images', [ImageController::class, 'index']);
    Route::post('/images', [ImageController::class, 'store'])->middleware('throttle:30,1');
    Route::get('/images/{image}', [ImageController::class, 'show']);
    Route::delete('/images/{image}', [ImageController::class, 'destroy']);

    Route::post('/images/{image}/ai/remove-background', [AiController::class, 'removeBackground']);
    Route::post('/images/{image}/ai/upscale', [AiController::class, 'upscale']);
    Route::post('/images/{image}/ai/auto-enhance', [AiController::class, 'autoEnhance']);
    Route::get('/ai-jobs/{aiJob}', [AiController::class, 'status']);

    // Admin-only routes
    Route::prefix('admin')->middleware('is_admin')->group(function () {
        Route::get('/stats', [AdminStatsController::class, 'index']);
        Route::get('/users', [AdminUserController::class, 'index']);
        Route::get('/users/{user}', [AdminUserController::class, 'show']);
        Route::put('/users/{user}', [AdminUserController::class, 'update']);
        Route::delete('/users/{user}', [AdminUserController::class, 'destroy']);
        Route::post('/users/{user}/toggle-active', [AdminUserController::class, 'toggleActive']);

        Route::get('/settings', [AdminSettingController::class, 'index']);
        Route::put('/settings', [AdminSettingController::class, 'update']);

        Route::get('/queue/stats', [AdminQueueController::class, 'stats']);
        Route::get('/queue/failed', [AdminQueueController::class, 'failedJobs']);
        Route::post('/queue/failed/{id}/retry', [AdminQueueController::class, 'retry']);
        Route::delete('/queue/failed/{id}', [AdminQueueController::class, 'forget']);
    });
});

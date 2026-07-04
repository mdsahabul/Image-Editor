<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Providers;

use App\Events\ExportCompleted;
use App\Events\ImageProcessed;
use App\Listeners\NotifyExportCompleted;
use App\Listeners\NotifyImageProcessed;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        ImageProcessed::class => [
            NotifyImageProcessed::class,
        ],
        ExportCompleted::class => [
            NotifyExportCompleted::class,
        ],
    ];

    public function boot(): void
    {
        //
    }
}

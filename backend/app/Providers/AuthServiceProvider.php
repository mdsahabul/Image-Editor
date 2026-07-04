<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Providers;

use App\Models\ImageAsset;
use App\Models\Layer;
use App\Models\Project;
use App\Policies\ImageAssetPolicy;
use App\Policies\LayerPolicy;
use App\Policies\ProjectPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Project::class => ProjectPolicy::class,
        ImageAsset::class => ImageAssetPolicy::class,
        Layer::class => LayerPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}

<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Events;

use App\Models\ImageAsset;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ImageProcessed
{
    use Dispatchable, SerializesModels;

    public function __construct(public ImageAsset $imageAsset)
    {
    }
}

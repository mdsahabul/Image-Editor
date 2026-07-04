<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Layer extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'image_asset_id',
        'type',
        'name',
        'z_index',
        'is_visible',
        'is_locked',
        'opacity',
        'transform_json',
        'style_json',
        'fabric_object_json',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
        'is_locked' => 'boolean',
        'opacity' => 'float',
        'transform_json' => 'array',
        'style_json' => 'array',
        'fabric_object_json' => 'array',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function imageAsset(): BelongsTo
    {
        return $this->belongsTo(ImageAsset::class);
    }
}

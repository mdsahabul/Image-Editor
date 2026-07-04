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
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'folder_id',
        'title',
        'canvas_width',
        'canvas_height',
        'background_color',
        'thumbnail_path',
        'is_template',
        'last_opened_at',
    ];

    protected $casts = [
        'is_template' => 'boolean',
        'last_opened_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(Folder::class);
    }

    public function layers(): HasMany
    {
        return $this->hasMany(Layer::class)->orderBy('z_index');
    }

    public function imageAssets(): HasMany
    {
        return $this->hasMany(ImageAsset::class);
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ProjectVersion::class)->latest();
    }

    public function exports(): HasMany
    {
        return $this->hasMany(Export::class);
    }

    public function touchLastOpened(): void
    {
        $this->forceFill(['last_opened_at' => now()])->save();
    }
}

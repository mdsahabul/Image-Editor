<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
        'avatar_path',
        'storage_quota_mb',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'is_active' => 'boolean',
        'password' => 'hashed',
    ];

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function folders(): HasMany
    {
        return $this->hasMany(Folder::class);
    }

    public function imageAssets(): HasMany
    {
        return $this->hasMany(ImageAsset::class);
    }

    public function aiJobs(): HasMany
    {
        return $this->hasMany(AiJob::class);
    }

    public function exports(): HasMany
    {
        return $this->hasMany(Export::class);
    }

    public function isAdmin(): bool
    {
        return $this->role?->name === 'admin';
    }

    public function hasUsedStorage(int $bytes): bool
    {
        $quotaBytes = $this->storage_quota_mb * 1024 * 1024;

        return ($this->storage_used_bytes + $bytes) > $quotaBytes;
    }

    public function incrementStorageUsage(int $bytes): void
    {
        $this->increment('storage_used_bytes', $bytes);
    }

    public function decrementStorageUsage(int $bytes): void
    {
        $this->decrement('storage_used_bytes', min($bytes, $this->storage_used_bytes));
    }
}

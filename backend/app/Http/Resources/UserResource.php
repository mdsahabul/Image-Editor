<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->whenLoaded('role', fn () => $this->role->name, $this->role?->name),
            'avatar_url' => $this->avatar_path ? \Storage::disk('public')->url($this->avatar_path) : null,
            'storage_quota_mb' => $this->storage_quota_mb,
            'storage_used_bytes' => $this->storage_used_bytes,
            'storage_used_percent' => $this->storage_quota_mb > 0
                ? round(($this->storage_used_bytes / ($this->storage_quota_mb * 1024 * 1024)) * 100, 1)
                : 0,
            'is_active' => $this->is_active,
            'email_verified_at' => $this->email_verified_at,
            'created_at' => $this->created_at,
        ];
    }
}

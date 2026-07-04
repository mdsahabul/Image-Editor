<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Policies;

use App\Models\ImageAsset;
use App\Models\User;

class ImageAssetPolicy
{
    public function view(User $user, ImageAsset $asset): bool
    {
        return $user->isAdmin() || $asset->user_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->is_active;
    }

    public function update(User $user, ImageAsset $asset): bool
    {
        return $user->isAdmin() || $asset->user_id === $user->id;
    }

    public function delete(User $user, ImageAsset $asset): bool
    {
        return $user->isAdmin() || $asset->user_id === $user->id;
    }
}

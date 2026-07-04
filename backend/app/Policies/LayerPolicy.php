<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Policies;

use App\Models\Layer;
use App\Models\User;

class LayerPolicy
{
    public function view(User $user, Layer $layer): bool
    {
        return $user->isAdmin() || $layer->project->user_id === $user->id;
    }

    public function update(User $user, Layer $layer): bool
    {
        return $user->isAdmin() || $layer->project->user_id === $user->id;
    }

    public function delete(User $user, Layer $layer): bool
    {
        return $user->isAdmin() || $layer->project->user_id === $user->id;
    }
}

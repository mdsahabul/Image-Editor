<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LayerResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'image_asset_id' => $this->image_asset_id,
            'image' => new ImageResource($this->whenLoaded('imageAsset')),
            'type' => $this->type,
            'name' => $this->name,
            'z_index' => $this->z_index,
            'is_visible' => $this->is_visible,
            'is_locked' => $this->is_locked,
            'opacity' => (float) $this->opacity,
            'transform' => $this->transform_json,
            'style' => $this->style_json,
            'fabric_object' => $this->fabric_object_json,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

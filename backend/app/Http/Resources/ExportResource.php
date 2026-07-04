<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'project_id' => $this->project_id,
            'format' => $this->format,
            'quality' => $this->quality,
            'width' => $this->width,
            'height' => $this->height,
            'download_url' => $this->download_url,
            'size_bytes' => $this->size_bytes,
            'status' => $this->status,
            'error_message' => $this->error_message,
            'created_at' => $this->created_at,
        ];
    }
}

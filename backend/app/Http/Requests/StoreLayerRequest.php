<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    public function rules(): array
    {
        return [
            'image_asset_id' => ['nullable', 'integer', 'exists:image_assets,id'],
            'type' => ['required', 'in:image,text,shape,group'],
            'name' => ['nullable', 'string', 'max:150'],
            'z_index' => ['nullable', 'integer'],
            'is_visible' => ['nullable', 'boolean'],
            'is_locked' => ['nullable', 'boolean'],
            'opacity' => ['nullable', 'numeric', 'min:0', 'max:1'],
            'transform_json' => ['required', 'array'],
            'transform_json.x' => ['required', 'numeric'],
            'transform_json.y' => ['required', 'numeric'],
            'transform_json.scaleX' => ['nullable', 'numeric'],
            'transform_json.scaleY' => ['nullable', 'numeric'],
            'transform_json.rotation' => ['nullable', 'numeric'],
            'style_json' => ['nullable', 'array'],
            'fabric_object_json' => ['nullable', 'array'],
        ];
    }
}

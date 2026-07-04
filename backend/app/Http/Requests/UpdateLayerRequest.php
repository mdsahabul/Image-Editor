<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLayerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('layer'));
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:150'],
            'z_index' => ['sometimes', 'integer'],
            'is_visible' => ['sometimes', 'boolean'],
            'is_locked' => ['sometimes', 'boolean'],
            'opacity' => ['sometimes', 'numeric', 'min:0', 'max:1'],
            'transform_json' => ['sometimes', 'array'],
            'style_json' => ['sometimes', 'nullable', 'array'],
            'fabric_object_json' => ['sometimes', 'nullable', 'array'],
        ];
    }
}

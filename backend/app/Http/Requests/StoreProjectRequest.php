<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\Project::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:200'],
            'folder_id' => ['nullable', 'integer', 'exists:folders,id'],
            'canvas_width' => ['nullable', 'integer', 'min:1', 'max:8000'],
            'canvas_height' => ['nullable', 'integer', 'min:1', 'max:8000'],
            'background_color' => ['nullable', 'string', 'max:20'],
            'is_template' => ['nullable', 'boolean'],
        ];
    }
}

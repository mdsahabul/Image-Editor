<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProjectRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:200'],
            'folder_id' => ['sometimes', 'nullable', 'integer', 'exists:folders,id'],
            'canvas_width' => ['sometimes', 'integer', 'min:1', 'max:8000'],
            'canvas_height' => ['sometimes', 'integer', 'min:1', 'max:8000'],
            'background_color' => ['sometimes', 'string', 'max:20'],
            'is_template' => ['sometimes', 'boolean'],
        ];
    }
}

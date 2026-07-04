<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ExportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('view', $this->route('project'));
    }

    public function rules(): array
    {
        return [
            'format' => ['required', Rule::in(config('imageeditor.export.allowed_formats'))],
            'quality' => ['nullable', 'integer', 'min:1', 'max:100'],
            'width' => ['nullable', 'integer', 'min:1', 'max:'.config('imageeditor.export.max_dimension')],
            'height' => ['nullable', 'integer', 'min:1', 'max:'.config('imageeditor.export.max_dimension')],
        ];
    }
}

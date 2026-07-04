<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreImageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->is_active;
    }

    public function rules(): array
    {
        $maxKb = config('imageeditor.max_upload_size_mb', 25) * 1024;

        return [
            'file' => [
                'required',
                'file',
                'image',
                'mimes:jpeg,jpg,png,webp,gif',
                "max:{$maxKb}",
            ],
            'project_id' => ['nullable', 'integer', 'exists:projects,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.max' => 'The image may not be larger than '.config('imageeditor.max_upload_size_mb', 25).' MB.',
            'file.image' => 'The uploaded file must be a valid image (JPEG, PNG, WebP, or GIF).',
        ];
    }
}

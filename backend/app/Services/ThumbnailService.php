<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Services;

use App\Models\User;
use Intervention\Image\Facades\Image;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ThumbnailService
{
    protected const THUMB_WIDTH = 400;

    public function __construct(protected string $disk = 'public')
    {
    }

    /**
     * Generate a thumbnail for a stored image and return its relative path.
     */
    public function generate(string $sourcePath, User $user, string $folder = 'thumbnails'): string
    {
        $fullSourcePath = Storage::disk($this->disk)->path($sourcePath);

        $image = Image::make($fullSourcePath);
        $image->resize(self::THUMB_WIDTH, null, function ($constraint) {
            $constraint->aspectRatio();
            $constraint->upsize();
        });

        $filename = Str::uuid().'.jpg';
        $relativePath = "{$folder}/{$user->id}/{$filename}";
        $absolutePath = Storage::disk($this->disk)->path($relativePath);

        Storage::disk($this->disk)->makeDirectory("{$folder}/{$user->id}");
        $image->encode('jpg', 80)->save($absolutePath);

        return $relativePath;
    }

    public function dimensions(string $sourcePath): array
    {
        $image = Image::make(Storage::disk($this->disk)->path($sourcePath));

        return ['width' => $image->width(), 'height' => $image->height()];
    }
}

<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Services;

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

class StorageService
{
    public function __construct(protected string $disk = 'public')
    {
    }

    /**
     * Store an uploaded file under a namespaced path, enforcing user quota.
     */
    public function storeUpload(UploadedFile $file, User $user, string $folder = 'originals'): array
    {
        $sizeBytes = $file->getSize();

        if ($user->hasUsedStorage($sizeBytes)) {
            throw new RuntimeException('Storage quota exceeded. Please free up space or upgrade your plan.');
        }

        $extension = $file->getClientOriginalExtension() ?: $file->extension();
        $filename = Str::uuid()->toString().'.'.$extension;
        $path = "{$folder}/{$user->id}/{$filename}";

        Storage::disk($this->disk)->put($path, file_get_contents($file->getRealPath()));

        $user->incrementStorageUsage($sizeBytes);

        return [
            'path' => $path,
            'size_bytes' => $sizeBytes,
            'checksum' => hash_file('sha256', $file->getRealPath()),
        ];
    }

    public function storeRaw(string $contents, User $user, string $folder, string $extension): array
    {
        $sizeBytes = strlen($contents);

        if ($user->hasUsedStorage($sizeBytes)) {
            throw new RuntimeException('Storage quota exceeded.');
        }

        $filename = Str::uuid()->toString().'.'.$extension;
        $path = "{$folder}/{$user->id}/{$filename}";

        Storage::disk($this->disk)->put($path, $contents);

        $user->incrementStorageUsage($sizeBytes);

        return ['path' => $path, 'size_bytes' => $sizeBytes];
    }

    public function delete(string $path, User $user, int $sizeBytes = 0): void
    {
        if (Storage::disk($this->disk)->exists($path)) {
            Storage::disk($this->disk)->delete($path);
        }

        if ($sizeBytes > 0) {
            $user->decrementStorageUsage($sizeBytes);
        }
    }

    public function url(string $path): string
    {
        return Storage::disk($this->disk)->url($path);
    }

    public function absolutePath(string $path): string
    {
        return Storage::disk($this->disk)->path($path);
    }
}

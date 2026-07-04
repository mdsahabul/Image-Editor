<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreImageRequest;
use App\Http\Resources\ImageResource;
use App\Jobs\ProcessImageUploadJob;
use App\Models\ActivityLog;
use App\Models\ImageAsset;
use App\Services\StorageService;
use Illuminate\Http\Request;
use RuntimeException;

class ImageController extends Controller
{
    public function __construct(protected StorageService $storageService)
    {
    }

    public function index(Request $request)
    {
        $query = $request->user()->imageAssets()->orderByDesc('created_at');

        if ($request->filled('project_id')) {
            $query->where('project_id', $request->integer('project_id'));
        }

        $images = $query->paginate($request->integer('per_page', 30));

        return $this->success([
            'items' => ImageResource::collection($images->items()),
            'pagination' => [
                'current_page' => $images->currentPage(),
                'last_page' => $images->lastPage(),
                'total' => $images->total(),
            ],
        ]);
    }

    public function store(StoreImageRequest $request)
    {
        try {
            $stored = $this->storageService->storeUpload($request->file('file'), $request->user());
        } catch (RuntimeException $e) {
            return $this->error($e->getMessage(), 422);
        }

        $asset = $request->user()->imageAssets()->create([
            'project_id' => $request->validated('project_id'),
            'original_name' => $request->file('file')->getClientOriginalName(),
            'disk' => 'public',
            'original_path' => $stored['path'],
            'mime_type' => $request->file('file')->getMimeType(),
            'size_bytes' => $stored['size_bytes'],
            'checksum_sha256' => $stored['checksum'],
            'status' => 'uploading',
        ]);

        ProcessImageUploadJob::dispatch($asset->id);

        ActivityLog::record('image.uploaded', "Image uploaded: {$asset->original_name}");

        return $this->success(new ImageResource($asset), 'Image uploaded, processing in background.', 201);
    }

    public function show(Request $request, ImageAsset $image)
    {
        $this->authorize('view', $image);

        return $this->success(new ImageResource($image));
    }

    public function destroy(Request $request, ImageAsset $image)
    {
        $this->authorize('delete', $image);

        $this->storageService->delete($image->original_path, $image->user, $image->size_bytes);

        if ($image->thumbnail_path) {
            $this->storageService->delete($image->thumbnail_path, $image->user);
        }

        $image->delete();

        ActivityLog::record('image.deleted', "Image deleted: {$image->original_name}");

        return $this->success(null, 'Image deleted.');
    }
}

<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Folder;
use Illuminate\Http\Request;

class FolderController extends Controller
{
    public function index(Request $request)
    {
        $folders = $request->user()->folders()
            ->whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->get();

        return $this->success($folders);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:150'],
            'parent_id' => ['nullable', 'integer', 'exists:folders,id'],
        ]);

        $folder = $request->user()->folders()->create($validated);

        return $this->success($folder, 'Folder created.', 201);
    }

    public function update(Request $request, Folder $folder)
    {
        abort_unless($folder->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:150'],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:folders,id'],
        ]);

        $folder->update($validated);

        return $this->success($folder, 'Folder updated.');
    }

    public function destroy(Request $request, Folder $folder)
    {
        abort_unless($folder->user_id === $request->user()->id || $request->user()->isAdmin(), 403);

        $folder->delete();

        return $this->success(null, 'Folder deleted.');
    }
}

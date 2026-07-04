<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLayerRequest;
use App\Http\Requests\UpdateLayerRequest;
use App\Http\Resources\LayerResource;
use App\Models\Layer;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LayerController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $layers = $project->layers()->with('imageAsset')->orderBy('z_index')->get();

        return $this->success(LayerResource::collection($layers));
    }

    public function store(StoreLayerRequest $request, Project $project)
    {
        $validated = $request->validated();
        $validated['z_index'] = $validated['z_index'] ?? ($project->layers()->max('z_index') + 1);

        $layer = $project->layers()->create($validated);

        return $this->success(new LayerResource($layer->load('imageAsset')), 'Layer created.', 201);
    }

    public function update(UpdateLayerRequest $request, Project $project, Layer $layer)
    {
        abort_unless($layer->project_id === $project->id, 404);

        $layer->update($request->validated());

        return $this->success(new LayerResource($layer->load('imageAsset')), 'Layer updated.');
    }

    public function destroy(Request $request, Project $project, Layer $layer)
    {
        $this->authorize('delete', $layer);
        abort_unless($layer->project_id === $project->id, 404);

        $layer->delete();

        return $this->success(null, 'Layer deleted.');
    }

    /**
     * Bulk reorder layers by passing an ordered array of layer IDs.
     */
    public function reorder(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $validated = $request->validate([
            'layer_ids' => ['required', 'array'],
            'layer_ids.*' => ['integer', 'exists:layers,id'],
        ]);

        DB::transaction(function () use ($validated, $project) {
            foreach ($validated['layer_ids'] as $index => $layerId) {
                Layer::where('id', $layerId)->where('project_id', $project->id)->update(['z_index' => $index]);
            }
        });

        return $this->success(LayerResource::collection($project->layers()->with('imageAsset')->orderBy('z_index')->get()), 'Layers reordered.');
    }

    /**
     * Save a full snapshot of the current layer tree as a version (for undo/redo history).
     */
    public function saveVersion(Request $request, Project $project)
    {
        $this->authorize('update', $project);

        $snapshot = $project->layers()->orderBy('z_index')->get()->toArray();

        $version = $project->versions()->create([
            'snapshot_json' => $snapshot,
            'label' => $request->input('label'),
        ]);

        // Keep only the most recent 50 versions per project to bound storage.
        $project->versions()->skip(50)->take(PHP_INT_MAX)->get()->each->delete();

        return $this->success($version, 'Version saved.', 201);
    }

    public function restoreVersion(Request $request, Project $project, int $versionId)
    {
        $this->authorize('update', $project);

        $version = $project->versions()->findOrFail($versionId);

        DB::transaction(function () use ($project, $version) {
            $project->layers()->delete();

            foreach ($version->snapshot_json as $layerData) {
                $project->layers()->create([
                    'image_asset_id' => $layerData['image_asset_id'] ?? null,
                    'type' => $layerData['type'],
                    'name' => $layerData['name'],
                    'z_index' => $layerData['z_index'],
                    'is_visible' => $layerData['is_visible'],
                    'is_locked' => $layerData['is_locked'],
                    'opacity' => $layerData['opacity'],
                    'transform_json' => $layerData['transform_json'],
                    'style_json' => $layerData['style_json'] ?? null,
                    'fabric_object_json' => $layerData['fabric_object_json'] ?? null,
                ]);
            }
        });

        return $this->success(LayerResource::collection($project->layers()->with('imageAsset')->orderBy('z_index')->get()), 'Version restored.');
    }
}

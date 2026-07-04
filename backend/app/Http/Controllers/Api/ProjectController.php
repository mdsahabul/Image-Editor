<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Models\ActivityLog;
use App\Models\Project;
use App\Services\CacheService;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function __construct(protected CacheService $cache)
    {
    }

    public function index(Request $request)
    {
        $query = $request->user()->projects()->with('folder')->orderByDesc('updated_at');

        if ($request->filled('folder_id')) {
            $query->where('folder_id', $request->integer('folder_id'));
        }

        if ($request->filled('search')) {
            $query->where('title', 'like', '%'.$request->string('search').'%');
        }

        $projects = $query->paginate($request->integer('per_page', 20));

        return $this->success([
            'items' => ProjectResource::collection($projects->items()),
            'pagination' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'total' => $projects->total(),
            ],
        ]);
    }

    public function store(StoreProjectRequest $request)
    {
        $project = $request->user()->projects()->create($request->validated());

        $this->cache->forgetUserProjects($request->user()->id);

        ActivityLog::record('project.created', "Project created: {$project->title}");

        return $this->success(new ProjectResource($project), 'Project created.', 201);
    }

    public function show(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $project->load('layers.imageAsset');
        $project->touchLastOpened();

        return $this->success(new ProjectResource($project));
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        $project->update($request->validated());

        $this->cache->forgetProject($project->id);
        $this->cache->forgetUserProjects($request->user()->id);

        return $this->success(new ProjectResource($project), 'Project updated.');
    }

    public function destroy(Request $request, Project $project)
    {
        $this->authorize('delete', $project);

        $project->delete();

        $this->cache->forgetUserProjects($request->user()->id);

        ActivityLog::record('project.deleted', "Project deleted: {$project->title}");

        return $this->success(null, 'Project deleted.');
    }

    public function duplicate(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $clone = $project->replicate(['thumbnail_path', 'last_opened_at']);
        $clone->title = $project->title.' (Copy)';
        $clone->save();

        foreach ($project->layers as $layer) {
            $newLayer = $layer->replicate();
            $newLayer->project_id = $clone->id;
            $newLayer->save();
        }

        return $this->success(new ProjectResource($clone->load('layers')), 'Project duplicated.', 201);
    }
}

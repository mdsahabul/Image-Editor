<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ExportRequest;
use App\Http\Resources\ExportResource;
use App\Jobs\RenderExportJob;
use App\Models\ActivityLog;
use App\Models\Export;
use App\Models\Project;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    public function index(Request $request, Project $project)
    {
        $this->authorize('view', $project);

        $exports = $project->exports()->orderByDesc('created_at')->paginate(15);

        return $this->success(ExportResource::collection($exports));
    }

    public function store(ExportRequest $request, Project $project)
    {
        $export = $project->exports()->create([
            'user_id' => $request->user()->id,
            'format' => $request->validated('format'),
            'quality' => $request->validated('quality', 90),
            'width' => $request->validated('width'),
            'height' => $request->validated('height'),
            'status' => 'queued',
        ]);

        RenderExportJob::dispatch($export->id);

        ActivityLog::record('export.requested', "Export requested for project: {$project->title}");

        return $this->success(new ExportResource($export), 'Export queued. Check status shortly.', 202);
    }

    public function show(Request $request, Project $project, Export $export)
    {
        $this->authorize('view', $project);
        abort_unless($export->project_id === $project->id, 404);

        return $this->success(new ExportResource($export));
    }
}

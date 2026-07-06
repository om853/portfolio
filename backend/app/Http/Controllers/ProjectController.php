<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        return response()->json(Project::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description' => 'required|string',
            'description_ar' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'photos' => 'nullable|array',
            'video' => 'nullable|string',
            'link' => 'nullable|string',
            'tech_stack' => 'nullable|array',
            'live_demo' => 'nullable|string',
            'github' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        $project = Project::create($validated);
        return response()->json($project, 201);
    }

    public function show(Project $project)
    {
        $project->increment('views');
        return response()->json($project);
    }

    public function update(Request $request, Project $project)
    {
        $validated = $request->validate([
            'title' => 'string|max:255',
            'title_ar' => 'nullable|string|max:255',
            'description' => 'string',
            'description_ar' => 'nullable|string',
            'type' => 'nullable|string|max:50',
            'image' => 'nullable|string',
            'photos' => 'nullable|array',
            'video' => 'nullable|string',
            'link' => 'nullable|string',
            'tech_stack' => 'nullable|array',
            'live_demo' => 'nullable|string',
            'github' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        $project->update($validated);
        return response()->json($project);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return response()->json(null, 204);
    }
}
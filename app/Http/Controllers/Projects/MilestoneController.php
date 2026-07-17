<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Milestone;
use Illuminate\Http\Request;

class MilestoneController extends Controller
{
    public function index()
    {
        $milestones = Milestone::with('project')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Milestones retrieved successfully.',
            'data' => $milestones
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'deadline' => 'nullable|date',
            'progress' => 'nullable|integer|between:0,100',
            'status' => 'nullable|in:pending,in_progress,completed',
        ]);

        $milestone = Milestone::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Milestone created successfully.',
            'data' => $milestone
        ], 201);
    }

    public function show(Milestone $milestone)
    {
        $milestone->load(['project', 'tasks']);

        return response()->json([
            'success' => true,
            'message' => 'Milestone retrieved successfully.',
            'data' => $milestone
        ]);
    }

    public function update(Request $request, Milestone $milestone)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'title' => 'sometimes|required|string|max:255',
            'deadline' => 'nullable|date',
            'progress' => 'nullable|integer|between:0,100',
            'status' => 'sometimes|required|in:pending,in_progress,completed',
        ]);

        $milestone->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Milestone updated successfully.',
            'data' => $milestone
        ]);
    }

    public function destroy(Milestone $milestone)
    {
        $milestone->delete();

        return response()->json([
            'success' => true,
            'message' => 'Milestone deleted successfully.',
            'data' => null
        ]);
    }
}

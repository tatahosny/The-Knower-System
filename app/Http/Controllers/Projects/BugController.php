<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\Bug;
use Illuminate\Http\Request;

class BugController extends Controller
{
    public function index()
    {
        $bugs = Bug::with(['project', 'task', 'reporter', 'assignee'])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Bugs retrieved successfully.',
            'data' => $bugs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'task_id' => 'nullable|exists:tasks,id',
            'assigned_to' => 'nullable|exists:users,id',
            'severity' => 'nullable|in:low,medium,high,critical',
            'status' => 'nullable|in:open,in_progress,resolved,closed',
            'description' => 'required|string',
            'steps_to_reproduce' => 'nullable|string',
        ]);

        $validated['reported_by'] = auth()->id();
        $bug = Bug::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bug reported successfully.',
            'data' => $bug
        ], 201);
    }

    public function show(Bug $bug)
    {
        $bug->load(['project', 'task', 'reporter', 'assignee']);

        return response()->json([
            'success' => true,
            'message' => 'Bug retrieved successfully.',
            'data' => $bug
        ]);
    }

    public function update(Request $request, Bug $bug)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'task_id' => 'nullable|exists:tasks,id',
            'assigned_to' => 'nullable|exists:users,id',
            'severity' => 'sometimes|required|in:low,medium,high,critical',
            'status' => 'sometimes|required|in:open,in_progress,resolved,closed',
            'description' => 'sometimes|required|string',
            'steps_to_reproduce' => 'nullable|string',
        ]);

        $bug->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Bug updated successfully.',
            'data' => $bug
        ]);
    }

    public function destroy(Bug $bug)
    {
        $bug->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bug deleted successfully.',
            'data' => null
        ]);
    }
}

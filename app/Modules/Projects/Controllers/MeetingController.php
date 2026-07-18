<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class MeetingController extends Controller
{
    public function index(Request $request)
    {
        $meetings = Meeting::with('project')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Meetings retrieved successfully.',
            'data' => $meetings
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string',
        ]);

        $meeting = Meeting::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meeting created successfully.',
            'data' => $meeting
        ], 201);
    }

    public function show(Meeting $meeting)
    {
        $meeting->load('project');

        return response()->json([
            'success' => true,
            'message' => 'Meeting retrieved successfully.',
            'data' => $meeting
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $validated = $request->validate([
            'project_id' => 'sometimes|required|exists:projects,id',
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'sometimes|required|date',
            'end_time' => 'sometimes|required|date|after:start_time',
            'location' => 'nullable|string',
        ]);

        $meeting->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Meeting updated successfully.',
            'data' => $meeting
        ]);
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Meeting deleted successfully.',
            'data' => null
        ]);
    }
}

<?php

namespace App\Modules\Projects\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\TimeLog;
use Illuminate\Http\Request;

class TimeLogController extends Controller
{
    public function index(Request $request)
    {
        $timeLogs = TimeLog::with(['task', 'user'])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Time logs retrieved successfully.',
            'data' => $timeLogs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'duration_minutes' => 'nullable|integer|min:0',
            'note' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id() ?? 1;

        $timeLog = TimeLog::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Time log created successfully.',
            'data' => $timeLog
        ], 201);
    }

    public function show(TimeLog $timeLog)
    {
        $timeLog->load(['task', 'user']);

        return response()->json([
            'success' => true,
            'message' => 'Time log retrieved successfully.',
            'data' => $timeLog
        ]);
    }

    public function update(Request $request, TimeLog $timeLog)
    {
        $validated = $request->validate([
            'start_time' => 'sometimes|required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'duration_minutes' => 'nullable|integer|min:0',
            'note' => 'nullable|string',
        ]);

        $timeLog->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Time log updated successfully.',
            'data' => $timeLog
        ]);
    }

    public function destroy(TimeLog $timeLog)
    {
        $timeLog->delete();

        return response()->json([
            'success' => true,
            'message' => 'Time log deleted successfully.',
            'data' => null
        ]);
    }
}

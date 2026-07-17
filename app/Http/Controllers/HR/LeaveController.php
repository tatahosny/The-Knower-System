<?php

namespace App\Http\Controllers\HR;

use App\Http\Controllers\Controller;
use App\Models\Leave;
use Illuminate\Http\Request;

class LeaveController extends Controller
{
    public function index()
    {
        $leaves = Leave::with('employee.user')->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Leave requests retrieved successfully.',
            'data' => $leaves
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'type' => 'required|in:annual,sick,emergency,unpaid,other',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'status' => 'nullable|in:pending,approved,rejected',
            'reason' => 'nullable|string',
        ]);

        $leave = Leave::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave requested successfully.',
            'data' => $leave
        ], 201);
    }

    public function show($id)
    {
        $leave = Leave::with('employee.user')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Leave request details retrieved.',
            'data' => $leave
        ]);
    }

    public function update(Request $request, $id)
    {
        $leave = Leave::findOrFail($id);

        $validated = $request->validate([
            'type' => 'sometimes|required|in:annual,sick,emergency,unpaid,other',
            'start_date' => 'sometimes|required|date',
            'end_date' => 'sometimes|required|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:pending,approved,rejected',
            'reason' => 'nullable|string',
        ]);

        $leave->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Leave request updated successfully.',
            'data' => $leave
        ]);
    }

    public function destroy($id)
    {
        $leave = Leave::findOrFail($id);
        $leave->delete();

        return response()->json([
            'success' => true,
            'message' => 'Leave request deleted successfully.',
            'data' => null
        ]);
    }
}

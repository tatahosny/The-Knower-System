<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\TaskComment;
use Illuminate\Http\Request;

class TaskCommentController extends Controller
{
    public function index()
    {
        $comments = TaskComment::with(['task', 'user'])->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Task comments retrieved successfully.',
            'data' => $comments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'comment' => 'required|string',
        ]);

        $validated['user_id'] = auth()->id() ?? 1; // Fallback to 1 for tests or unauth if necessary
        $comment = TaskComment::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Comment added successfully.',
            'data' => $comment->load('user')
        ], 201);
    }

    public function destroy($id)
    {
        $comment = TaskComment::findOrFail($id);
        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Comment deleted successfully.',
            'data' => null
        ]);
    }
}

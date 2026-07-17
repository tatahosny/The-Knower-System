<?php

namespace App\Http\Controllers\Projects;

use App\Http\Controllers\Controller;
use App\Models\File;
use Illuminate\Http\Request;

class FileController extends Controller
{
    public function index()
    {
        $files = File::with(['project', 'uploader'])->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Files retrieved successfully.',
            'data' => $files
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => 'required|exists:projects,id',
            'file_name' => 'required|string|max:255',
            'file_path' => 'required|string|max:255',
            'size' => 'nullable|integer',
            'type' => 'nullable|string|max:100',
        ]);

        $validated['uploaded_by'] = auth()->id();
        $file = File::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'File entry logged successfully.',
            'data' => $file
        ], 201);
    }

    public function show($id)
    {
        $file = File::with(['project', 'uploader'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'File retrieved successfully.',
            'data' => $file
        ]);
    }

    public function destroy($id)
    {
        $file = File::findOrFail($id);
        $file->delete();

        return response()->json([
            'success' => true,
            'message' => 'File deleted successfully.',
            'data' => null
        ]);
    }
}

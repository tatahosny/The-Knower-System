<?php

namespace App\Http\Controllers\Hosting;

use App\Http\Controllers\Controller;
use App\Models\Server;
use Illuminate\Http\Request;

class ServerController extends Controller
{
    public function index()
    {
        $servers = Server::withCount('hostingAccounts')->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Servers retrieved successfully.',
            'data' => $servers
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'provider' => 'nullable|string|max:100',
            'ip' => 'nullable|ip|max:45',
            'location' => 'nullable|string|max:100',
            'os' => 'nullable|string|max:100',
            'status' => 'nullable|in:active,inactive,maintenance',
            'notes' => 'nullable|string',
        ]);

        $server = Server::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Server created successfully.',
            'data' => $server
        ], 201);
    }

    public function show($id)
    {
        $server = Server::with('hostingAccounts.client')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Server retrieved successfully.',
            'data' => $server
        ]);
    }

    public function update(Request $request, $id)
    {
        $server = Server::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'provider' => 'nullable|string|max:100',
            'ip' => 'nullable|ip|max:45',
            'location' => 'nullable|string|max:100',
            'os' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:active,inactive,maintenance',
            'notes' => 'nullable|string',
        ]);

        $server->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Server updated successfully.',
            'data' => $server
        ]);
    }

    public function destroy($id)
    {
        $server = Server::findOrFail($id);
        $server->delete();

        return response()->json([
            'success' => true,
            'message' => 'Server deleted successfully.',
            'data' => null
        ]);
    }
}

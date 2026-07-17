<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::with('company')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Clients retrieved successfully.',
            'data' => $clients
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_id' => 'nullable|exists:companies,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:clients,email|max:255',
            'phone' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:100',
            'status' => 'nullable|in:active,inactive,prospect',
        ]);

        $client = Client::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client created successfully.',
            'data' => $client
        ], 201);
    }

    public function show(Client $client)
    {
        $client->load(['company', 'projects', 'invoices', 'tickets']);

        return response()->json([
            'success' => true,
            'message' => 'Client retrieved successfully.',
            'data' => $client
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'company_id' => 'nullable|exists:companies,id',
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:clients,email,' . $client->id,
            'phone' => 'nullable|string|max:50',
            'position' => 'nullable|string|max:100',
            'status' => 'sometimes|required|in:active,inactive,prospect',
        ]);

        $client->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Client updated successfully.',
            'data' => $client
        ]);
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client deleted successfully.',
            'data' => null
        ]);
    }
}

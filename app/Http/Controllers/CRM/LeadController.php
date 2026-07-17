<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;

class LeadController extends Controller
{
    public function index()
    {
        $leads = Lead::with('assignee')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Leads retrieved successfully.',
            'data' => $leads
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:100',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'nullable|in:new,contacted,qualified,lost,converted',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lead created successfully.',
            'data' => $lead
        ], 201);
    }

    public function show(Lead $lead)
    {
        $lead->load('assignee');

        return response()->json([
            'success' => true,
            'message' => 'Lead retrieved successfully.',
            'data' => $lead
        ]);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'source' => 'nullable|string|max:100',
            'budget' => 'nullable|numeric|min:0',
            'status' => 'sometimes|required|in:new,contacted,qualified,lost,converted',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $lead->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Lead updated successfully.',
            'data' => $lead
        ]);
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();

        return response()->json([
            'success' => true,
            'message' => 'Lead deleted successfully.',
            'data' => null
        ]);
    }
}

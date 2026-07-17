<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Quotation;
use Illuminate\Http\Request;

class QuotationController extends Controller
{
    public function index()
    {
        $quotations = Quotation::with('client')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Quotations retrieved successfully.',
            'data' => $quotations
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'quotation_number' => 'required|string|unique:quotations,quotation_number|max:100',
            'price' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'nullable|in:draft,sent,accepted,rejected,expired',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $quotation = Quotation::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Quotation created successfully.',
            'data' => $quotation
        ], 201);
    }

    public function show(Quotation $quotation)
    {
        $quotation->load(['client', 'contract']);

        return response()->json([
            'success' => true,
            'message' => 'Quotation retrieved successfully.',
            'data' => $quotation
        ]);
    }

    public function update(Request $request, Quotation $quotation)
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'quotation_number' => 'sometimes|required|string|max:100|unique:quotations,quotation_number,' . $quotation->id,
            'price' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'sometimes|required|in:draft,sent,accepted,rejected,expired',
            'valid_until' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $quotation->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Quotation updated successfully.',
            'data' => $quotation
        ]);
    }

    public function destroy(Quotation $quotation)
    {
        $quotation->delete();

        return response()->json([
            'success' => true,
            'message' => 'Quotation deleted successfully.',
            'data' => null
        ]);
    }
}

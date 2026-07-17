<?php

namespace App\Http\Controllers\CRM;

use App\Http\Controllers\Controller;
use App\Models\Contract;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function index()
    {
        $contracts = Contract::with(['client', 'quotation'])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Contracts retrieved successfully.',
            'data' => $contracts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'quotation_id' => 'nullable|exists:quotations,id',
            'contract_number' => 'required|string|unique:contracts,contract_number|max:100',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'nullable|in:draft,active,completed,terminated',
            'file' => 'nullable|string|max:255',
        ]);

        $contract = Contract::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Contract created successfully.',
            'data' => $contract
        ], 201);
    }

    public function show(Contract $contract)
    {
        $contract->load(['client', 'quotation']);

        return response()->json([
            'success' => true,
            'message' => 'Contract retrieved successfully.',
            'data' => $contract
        ]);
    }

    public function update(Request $request, Contract $contract)
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'quotation_id' => 'nullable|exists:quotations,id',
            'contract_number' => 'sometimes|required|string|max:100|unique:contracts,contract_number,' . $contract->id,
            'start_date' => 'sometimes|required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'sometimes|required|in:draft,active,completed,terminated',
            'file' => 'nullable|string|max:255',
        ]);

        $contract->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Contract updated successfully.',
            'data' => $contract
        ]);
    }

    public function destroy(Contract $contract)
    {
        $contract->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contract deleted successfully.',
            'data' => null
        ]);
    }
}

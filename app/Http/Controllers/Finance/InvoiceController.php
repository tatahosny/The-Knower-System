<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::with(['client', 'project'])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Invoices retrieved successfully.',
            'data' => $invoices
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_number' => 'required|string|unique:invoices,invoice_number|max:100',
            'amount' => 'required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'nullable|in:draft,sent,paid,overdue,cancelled',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $invoice = Invoice::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice created successfully.',
            'data' => $invoice
        ], 201);
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['client', 'project', 'payments']);

        return response()->json([
            'success' => true,
            'message' => 'Invoice retrieved successfully.',
            'data' => $invoice
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        $validated = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'invoice_number' => 'sometimes|required|string|max:100|unique:invoices,invoice_number,' . $invoice->id,
            'amount' => 'sometimes|required|numeric|min:0',
            'currency' => 'nullable|string|max:10',
            'status' => 'sometimes|required|in:draft,sent,paid,overdue,cancelled',
            'due_date' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $invoice->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Invoice updated successfully.',
            'data' => $invoice
        ]);
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted successfully.',
            'data' => null
        ]);
    }
}

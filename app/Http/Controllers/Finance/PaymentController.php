<?php

namespace App\Http\Controllers\Finance;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\Invoice;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('invoice.client')->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Payments retrieved successfully.',
            'data' => $payments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'method' => 'required|in:cash,bank_transfer,vodafone_cash,instapay,paypal,stripe,other',
            'amount' => 'required|numeric|min:0',
            'paid_at' => 'nullable|date',
            'reference' => 'nullable|string|max:255',
        ]);

        $payment = Payment::create($validated);

        // Auto-update invoice status to paid if payment covers it
        $invoice = Invoice::findOrFail($validated['invoice_id']);
        $totalPaid = $invoice->payments()->sum('amount');
        if ($totalPaid >= $invoice->amount) {
            $invoice->update(['status' => 'paid']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully.',
            'data' => $payment
        ], 201);
    }

    public function destroy($id)
    {
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment record deleted successfully.',
            'data' => null
        ]);
    }
}

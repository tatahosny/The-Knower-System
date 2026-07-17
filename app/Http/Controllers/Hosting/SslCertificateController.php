<?php

namespace App\Http\Controllers\Hosting;

use App\Http\Controllers\Controller;
use App\Models\SslCertificate;
use Illuminate\Http\Request;

class SslCertificateController extends Controller
{
    public function index()
    {
        $certs = SslCertificate::with('domain')->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'SSL certificates retrieved successfully.',
            'data' => $certs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'domain_id' => 'required|exists:domains,id',
            'provider' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'status' => 'nullable|in:active,expired,revoked',
        ]);

        $cert = SslCertificate::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'SSL certificate log created successfully.',
            'data' => $cert
        ], 201);
    }

    public function show($id)
    {
        $cert = SslCertificate::with('domain')->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'SSL certificate retrieved successfully.',
            'data' => $cert
        ]);
    }

    public function update(Request $request, $id)
    {
        $cert = SslCertificate::findOrFail($id);

        $validated = $request->validate([
            'domain_id' => 'sometimes|required|exists:domains,id',
            'provider' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'status' => 'sometimes|required|in:active,expired,revoked',
        ]);

        $cert->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'SSL certificate updated successfully.',
            'data' => $cert
        ]);
    }

    public function destroy($id)
    {
        $cert = SslCertificate::findOrFail($id);
        $cert->delete();

        return response()->json([
            'success' => true,
            'message' => 'SSL certificate deleted successfully.',
            'data' => null
        ]);
    }
}

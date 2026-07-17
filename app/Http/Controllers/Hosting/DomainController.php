<?php

namespace App\Http\Controllers\Hosting;

use App\Http\Controllers\Controller;
use App\Models\Domain;
use Illuminate\Http\Request;

class DomainController extends Controller
{
    public function index()
    {
        $domains = Domain::with(['client', 'project', 'sslCertificates'])->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Domains retrieved successfully.',
            'data' => $domains
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'domain' => 'required|string|unique:domains,domain|max:255',
            'registrar' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'auto_renew' => 'nullable|boolean',
            'status' => 'nullable|in:active,expired,transferred,pending',
        ]);

        $domain = Domain::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Domain created successfully.',
            'data' => $domain
        ], 201);
    }

    public function show($id)
    {
        $domain = Domain::with(['client', 'project', 'sslCertificates'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Domain retrieved successfully.',
            'data' => $domain
        ]);
    }

    public function update(Request $request, $id)
    {
        $domain = Domain::findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'domain' => 'sometimes|required|string|max:255|unique:domains,domain,' . $domain->id,
            'registrar' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'auto_renew' => 'nullable|boolean',
            'status' => 'sometimes|required|in:active,expired,transferred,pending',
        ]);

        $domain->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Domain updated successfully.',
            'data' => $domain
        ]);
    }

    public function destroy($id)
    {
        $domain = Domain::findOrFail($id);
        $domain->delete();

        return response()->json([
            'success' => true,
            'message' => 'Domain deleted successfully.',
            'data' => null
        ]);
    }
}

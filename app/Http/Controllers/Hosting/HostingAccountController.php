<?php

namespace App\Http\Controllers\Hosting;

use App\Http\Controllers\Controller;
use App\Models\HostingAccount;
use Illuminate\Http\Request;

class HostingAccountController extends Controller
{
    public function index()
    {
        $accounts = HostingAccount::with(['client', 'project', 'server'])->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Hosting accounts retrieved successfully.',
            'data' => $accounts
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'server_id' => 'nullable|exists:servers,id',
            'provider' => 'required|string|max:100',
            'plan' => 'nullable|string|max:100',
            'username' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'status' => 'nullable|in:active,inactive,suspended,expired',
            'auto_renew' => 'nullable|boolean',
        ]);

        $account = HostingAccount::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hosting account created successfully.',
            'data' => $account
        ], 201);
    }

    public function show($id)
    {
        $account = HostingAccount::with(['client', 'project', 'server'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Hosting account retrieved successfully.',
            'data' => $account
        ]);
    }

    public function update(Request $request, $id)
    {
        $account = HostingAccount::findOrFail($id);

        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'server_id' => 'nullable|exists:servers,id',
            'provider' => 'sometimes|required|string|max:100',
            'plan' => 'nullable|string|max:100',
            'username' => 'nullable|string|max:100',
            'expiry_date' => 'nullable|date',
            'status' => 'sometimes|required|in:active,inactive,suspended,expired',
            'auto_renew' => 'nullable|boolean',
        ]);

        $account->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Hosting account updated successfully.',
            'data' => $account
        ]);
    }

    public function destroy($id)
    {
        $account = HostingAccount::findOrFail($id);
        $account->delete();

        return response()->json([
            'success' => true,
            'message' => 'Hosting account deleted successfully.',
            'data' => null
        ]);
    }
}

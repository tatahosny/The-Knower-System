<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::with(['client', 'project', 'assignee'])->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Tickets retrieved successfully.',
            'data' => $tickets
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'subject' => 'required|string|max:255',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'status' => 'nullable|in:open,in_progress,waiting,resolved,closed',
        ]);

        $ticket = Ticket::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ticket opened successfully.',
            'data' => $ticket
        ], 201);
    }

    public function show(Ticket $ticket)
    {
        $ticket->load(['client', 'project', 'assignee', 'messages.sender']);

        return response()->json([
            'success' => true,
            'message' => 'Ticket retrieved successfully.',
            'data' => $ticket
        ]);
    }

    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'client_id' => 'nullable|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'assigned_to' => 'nullable|exists:users,id',
            'subject' => 'sometimes|required|string|max:255',
            'priority' => 'sometimes|required|in:low,medium,high,urgent',
            'status' => 'sometimes|required|in:open,in_progress,waiting,resolved,closed',
        ]);

        $ticket->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Ticket updated successfully.',
            'data' => $ticket
        ]);
    }

    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return response()->json([
            'success' => true,
            'message' => 'Ticket closed and deleted successfully.',
            'data' => null
        ]);
    }
}

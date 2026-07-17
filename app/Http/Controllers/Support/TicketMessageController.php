<?php

namespace App\Http\Controllers\Support;

use App\Http\Controllers\Controller;
use App\Models\TicketMessage;
use Illuminate\Http\Request;

class TicketMessageController extends Controller
{
    public function index()
    {
        $messages = TicketMessage::with(['ticket', 'sender'])->latest('id')->get();

        return response()->json([
            'success' => true,
            'message' => 'Ticket messages retrieved successfully.',
            'data' => $messages
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'message' => 'required|string',
            'attachment' => 'nullable|string|max:255',
        ]);

        $validated['sender_id'] = auth()->id();
        $message = TicketMessage::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Reply posted successfully.',
            'data' => $message->load('sender')
        ], 201);
    }

    public function destroy($id)
    {
        $message = TicketMessage::findOrFail($id);
        $message->delete();

        return response()->json([
            'success' => true,
            'message' => 'Message deleted successfully.',
            'data' => null
        ]);
    }
}

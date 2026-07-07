<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\NewContactNotification;

class MessageController extends Controller
{
    public function index()
    {
        return response()->json(Message::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $message = Message::create($validated);

        try {
            Mail::to('mrmhmdalshhatly@gmail.com')->send(new NewContactNotification(
                $validated['name'],
                $validated['email'],
                $validated['phone'] ?? null,
                $validated['message']
            ));
        } catch (\Exception $e) {
            // Log but don't break the response
        }

        return response()->json($message, 201);
    }

    public function show(Message $message)
    {
        return response()->json($message);
    }

    public function update(Request $request, Message $message)
    {
        $validated = $request->validate([
            'is_read' => 'required|boolean',
        ]);

        $message->update($validated);
        return response()->json($message);
    }

    public function destroy(Message $message)
    {
        $message->delete();
        return response()->json(null, 204);
    }
}
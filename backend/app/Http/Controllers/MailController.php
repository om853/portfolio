<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReplyToClient;

class MailController extends Controller
{
    public function reply(Request $request)
    {
        $validated = $request->validate([
            'message_id' => 'required|exists:messages,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $message = Message::findOrFail($validated['message_id']);

        try {
            Mail::to($message->email)->send(new ReplyToClient(
                $message->name,
                $message->email,
                $validated['subject'],
                $validated['body']
            ));

            $message->update([
                'is_read' => true,
                'replied_at' => now(),
            ]);

            return response()->json(['message' => 'Email sent successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
}
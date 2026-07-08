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

        \Log::channel('mail')->info('Attempting to send email reply', [
            'message_id' => $message->id,
            'to' => $message->email,
            'subject' => $validated['subject'],
            'config' => [
                'host' => config('mail.mailers.smtp.host'),
                'port' => config('mail.mailers.smtp.port'),
                'encryption' => config('mail.mailers.smtp.encryption'),
                'timeout' => config('mail.mailers.smtp.timeout'),
            ],
        ]);

        try {
            Mail::to($message->email)->send(new ReplyToClient(
                $message->name,
                $message->email,
                $validated['subject'],
                $validated['body']
            ));

            \Log::channel('mail')->info('Email sent successfully', [
                'message_id' => $message->id,
                'to' => $message->email,
            ]);

            $message->update([
                'is_read' => true,
                'replied_at' => now(),
            ]);

            return response()->json(['message' => 'Email sent successfully']);
        } catch (\Exception $e) {
            \Log::channel('mail')->error('Email sending failed', [
                'message_id' => $message->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json(['error' => 'Failed to send email: ' . $e->getMessage()], 500);
        }
    }
}
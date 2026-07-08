<?php

namespace App\Http\Controllers;

use App\Models\Message;
use Illuminate\Http\Request;
use App\Mail\ReplyToClient;
use App\Services\ResendService;
use Illuminate\Support\Facades\Log;

class MailController extends Controller
{
    protected $resend;

    public function __construct(ResendService $resend)
    {
        $this->resend = $resend;
    }

    public function reply(Request $request)
    {
        $validated = $request->validate([
            'message_id' => 'required|exists:messages,id',
            'subject' => 'required|string|max:255',
            'body' => 'required|string',
        ]);

        $message = Message::findOrFail($validated['message_id']);

        \Log::channel('mail')->info('Attempting to send email reply via Resend', [
            'message_id' => $message->id,
            'to' => $message->email,
            'subject' => $validated['subject'],
        ]);

        try {
            // Reuse the existing HTML structure from ReplyToClient
            $mailable = new ReplyToClient(
                $message->name,
                $message->email,
                $validated['subject'],
                $validated['body']
            );

            // Use reflection to call the private buildHtml method
            $reflection = new \ReflectionClass($mailable);
            $method = $reflection->getMethod('buildHtml');
            $method->setAccessible(true);
            $html = $method->invoke($mailable);

            $this->resend->sendEmail(
                $message->email,
                $validated['subject'],
                $html,
                'onboarding@resend.dev'
            );

            \Log::channel('mail')->info('Email sent successfully via Resend', [
                'message_id' => $message->id,
                'to' => $message->email,
            ]);

            $message->update([
                'is_read' => true,
                'replied_at' => now(),
            ]);

            return response()->json(['message' => 'Email sent successfully via Resend']);
        } catch (\Exception $e) {
            \Log::channel('mail')->error('Resend sending failed', [
                'message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);
            return response()->json(['error' => 'Failed to send email via Resend: ' . $e->getMessage()], 500);
        }
    }
}
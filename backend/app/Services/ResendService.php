<?php

namespace App\Services;

use Resend;
use Illuminate\Support\Facades\Log;

class ResendService
{
    protected $client;

    public function __construct()
    {
        // Get API key from .env for security
        $apiKey = env('RESEND_API_KEY', 're_Td36WBV2_6WnGbi6o27bByLXNfxHH8dWj');
        $this->client = Resend::client($apiKey);
    }

    public function sendEmail($to, $subject, $html, $from = null)
    {
        $from = $from ?: 'noreply@' . env('RESEND_DOMAIN', 'devomarelshahat.vercle.app');

        try {
            $response = $this->client->emails->send([
                'from' => $from,
                'to' => $to,
                'subject' => $subject,
                'html' => $html,
            ]);

            return $response;
        } catch (\Exception $e) {
            Log::channel('mail')->error('Resend API Error', [
                'error' => $e->getMessage(),
                'to' => $to,
            ]);
            throw $e;
        }
    }
}

<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class ResendService
{
    protected Client $client;
    protected string $apiKey;
    protected string $fromEmail;

    public function __construct()
    {
        $this->apiKey = env('MAILERSEND_API_KEY');
        $this->fromEmail = env('MAILERSEND_FROM_EMAIL');
        $this->client = new Client(['base_uri' => 'https://api.mailersend.com']);
    }

    public function sendEmail($to, $subject, $html, $from = null)
    {
        if (!$this->apiKey) {
            throw new \RuntimeException('MAILERSEND_API_KEY is not set. Add it to your .env or Railway environment variables.');
        }
        if (!$from && !$this->fromEmail) {
            throw new \RuntimeException('MAILERSEND_FROM_EMAIL is not set. Add it to your .env or Railway environment variables.');
        }
        $from = $from ?: $this->fromEmail;

        try {
            $response = $this->client->post('/v1/email', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'from' => ['email' => $from],
                    'to' => [['email' => $to]],
                    'subject' => $subject,
                    'html' => $html,
                ],
            ]);

            $body = json_decode((string) $response->getBody(), true);
            return $body;
        } catch (\Exception $e) {
            Log::channel('mail')->error('MailerSend API Error', [
                'error' => $e->getMessage(),
                'to' => $to,
            ]);
            throw $e;
        }
    }
}

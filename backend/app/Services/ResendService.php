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
        $this->apiKey = env('MAILERSEND_API_KEY', 'mlsn.cc30df0289cb5fc9464f13bd2709213927e397a0e5756bec0be77de7d41c6083');
        $this->fromEmail = env('MAILERSEND_FROM_EMAIL', 'MS_MUlyNh@test-65qngkdq9xwlwr12.mlsender.net');
        $this->client = new Client(['base_uri' => 'https://api.mailersend.com']);
    }

    public function sendEmail($to, $subject, $html, $from = null)
    {
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

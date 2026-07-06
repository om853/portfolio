<?php

namespace App\Services\AiProviders;

use Illuminate\Support\Facades\Http;

class GrokProvider implements AiProviderInterface
{
    public function getName(): string
    {
        return 'grok';
    }

    public function chat(array $messages, array $options = []): array
    {
        $apiKey = $options['api_key'] ?? env('GROK_API_KEY');

        $response = Http::withToken($apiKey)
            ->timeout(60)
            ->post('https://api.x.ai/v1/chat/completions', [
                'model' => $options['model'] ?? 'grok-2',
                'messages' => $messages,
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 2048,
            ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Grok API Error: ' . $response->body(), $response->status());
    }
}

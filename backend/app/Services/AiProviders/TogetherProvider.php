<?php

namespace App\Services\AiProviders;

use Illuminate\Support\Facades\Http;

class TogetherProvider implements AiProviderInterface
{
    public function getName(): string
    {
        return 'together';
    }

    public function chat(array $messages, array $options = []): array
    {
        $apiKey = $options['api_key'] ?? env('TOGETHER_API_KEY');

        $response = Http::withToken($apiKey)
            ->timeout(60)
            ->post('https://api.together.xyz/v1/chat/completions', [
                'model' => $options['model'] ?? 'mistralai/Mixtral-8x7B-Instruct-v0.1',
                'messages' => $messages,
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 2048,
            ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('Together API Error: ' . $response->body(), $response->status());
    }
}

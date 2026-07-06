<?php

namespace App\Services\AiProviders;

use Illuminate\Support\Facades\Http;

class HuggingFaceProvider implements AiProviderInterface
{
    public function getName(): string
    {
        return 'huggingface';
    }

    public function chat(array $messages, array $options = []): array
    {
        $apiKey = $options['api_key'] ?? env('HF_API_KEY');

        $model = $options['model'] ?? 'mistralai/Mistral-7B-Instruct-v0.3';
        $url = "https://api-inference.huggingface.co/models/{$model}/v1/chat/completions";

        $response = Http::withToken($apiKey)
            ->timeout(60)
            ->post($url, [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 2048,
            ]);

        if ($response->successful()) {
            return $response->json();
        }

        throw new \Exception('HuggingFace API Error: ' . $response->body(), $response->status());
    }
}

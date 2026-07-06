<?php

namespace App\Services\AiProviders;

use Illuminate\Support\Facades\Http;

class DeepSeekProvider implements AiProviderInterface
{
    public function getName(): string
    {
        return 'deepseek';
    }

    public function chat(array $messages, array $options = []): array
    {
        $apiKey = $options['api_key'] ?? env('DEEPSEEK_API_KEY');

        if ($apiKey && $apiKey !== 'dummy-key-for-testing') {
            $response = Http::withToken($apiKey)
                ->timeout(15)
                ->post('https://api.deepseek.com/chat/completions', [
                    'model' => $options['model'] ?? 'deepseek-chat',
                    'messages' => $messages,
                    'temperature' => $options['temperature'] ?? 0.7,
                    'max_tokens' => $options['max_tokens'] ?? 2048,
                ]);

            if ($response->successful()) {
                $data = $response->json();
                $text = trim($data['choices'][0]['message']['content'] ?? '');

                if ($text === '') {
                    throw new \Exception('DeepSeek API returned empty content');
                }

                return $data;
            }

            throw new \Exception('DeepSeek API Error: ' . $response->body(), $response->status());
        }

        $responseText = ConversationMockHelper::respond($messages);

        return [
            'choices' => [
                [
                    'message' => [
                        'role' => 'assistant',
                        'content' => $responseText,
                    ],
                ],
            ],
            'usage' => [
                'prompt_tokens' => 10,
                'completion_tokens' => 20,
            ],
            'model' => 'deepseek-mock',
        ];
    }
}

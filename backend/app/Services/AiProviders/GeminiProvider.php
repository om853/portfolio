<?php

namespace App\Services\AiProviders;

use Illuminate\Support\Facades\Http;

class GeminiProvider implements AiProviderInterface
{
    public function getName(): string
    {
        return 'gemini';
    }

    public function chat(array $messages, array $options = []): array
    {
        $apiKey = $options['api_key'] ?? env('GEMINI_API_KEY');

        if ($apiKey && $apiKey !== 'dummy-key-for-testing') {
            $contents = [];
            $systemInstruction = null;

            foreach ($messages as $msg) {
                $role = $msg['role'] ?? 'user';
                $text = $msg['content'] ?? '';

                if ($role === 'system') {
                    $systemInstruction = ['parts' => [['text' => $text]]];
                    continue;
                }

                $contents[] = [
                    'role' => $role === 'assistant' ? 'model' : 'user',
                    'parts' => [['text' => $text]],
                ];
            }

            $payload = [
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => $options['temperature'] ?? 0.7,
                    'maxOutputTokens' => $options['max_tokens'] ?? 2048,
                ],
            ];

            if ($systemInstruction) {
                $payload['systemInstruction'] = $systemInstruction;
            }

            $model = $options['model'] ?? 'gemini-2.5-flash';
            $response = Http::timeout(60)
                ->post("https://generativelanguage.googleapis.com/v1beta/models/{$model}:generateContent?key={$apiKey}", $payload);

            if ($response->successful()) {
                $data = $response->json();
                $text = trim($data['candidates'][0]['content']['parts'][0]['text'] ?? '');

                if ($text === '') {
                    throw new \Exception('Gemini API returned empty content');
                }

                return [
                    'choices' => [
                        [
                            'message' => [
                                'role' => 'assistant',
                                'content' => $text,
                            ],
                        ],
                    ],
                    'usage' => [
                        'prompt_tokens' => $data['usageMetadata']['promptTokenCount'] ?? 0,
                        'completion_tokens' => $data['usageMetadata']['candidatesTokenCount'] ?? 0,
                    ],
                    'model' => $model,
                ];
            }

            throw new \Exception('Gemini API Error: ' . $response->body(), $response->status());
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
            'model' => 'gemini-mock',
        ];
    }
}

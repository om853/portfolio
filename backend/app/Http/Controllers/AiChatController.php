<?php

namespace App\Http\Controllers;

use App\Services\AiProviderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AiChatController extends Controller
{
    protected AiProviderService $aiProvider;

    public function __construct(AiProviderService $aiProvider)
    {
        $this->aiProvider = $aiProvider;
    }

    public function chat(Request $request)
    {
        $request->validate([
            'messages' => 'required|array',
            'locale' => 'string|in:en,ar',
            'provider' => 'nullable|string',
        ]);

        $provider = $request->input('provider', config('ai.default_provider', 'deepseek'));
        $messages = $this->sanitizeMessages($request->messages);

        try {
            $result = $this->aiProvider->chat($provider, $messages, ['locale' => $request->input('locale')]);
            $normalized = $this->normalizeChatResponse($result);

            $content = $normalized['choices'][0]['message']['content'] ?? '';
            if (trim($content) === '') {
                $mock = \App\Services\AiProviders\ConversationMockHelper::respond($messages);
                $normalized['choices'][0]['message']['content'] = $mock;
                $normalized['model'] = ($normalized['model'] ?? $provider) . '-fallback';
            }

            return response()->json($normalized);
        } catch (\RuntimeException $e) {
            return response()->json([
                'error' => 'AI Service is currently unavailable. No API keys left.'
            ], 503);
        } catch (\InvalidArgumentException $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 400);
        } catch (\Exception $e) {
            Log::error("{$provider} API Error", [
                'message' => $e->getMessage(),
                'code' => $e->getCode(),
            ]);
            return response()->json([
                'error' => 'AI Service returned an error'
            ], 502);
        }
    }

    protected function normalizeChatResponse(array $response): array
    {
        if (isset($response['choices']) && is_array($response['choices'])) {
            $response['choices'] = array_map(function ($choice) {
                $message = null;

                if (isset($choice['message']) && is_array($choice['message'])) {
                    $message = $choice['message'];
                } elseif (isset($choice['content'])) {
                    $message = ['role' => 'assistant', 'content' => $choice['content']];
                } elseif (isset($choice['text'])) {
                    $message = ['role' => 'assistant', 'content' => $choice['text']];
                }

                if (!is_array($message)) {
                    $message = ['role' => 'assistant', 'content' => ''];
                }

                if (!isset($message['role'])) {
                    $message['role'] = 'assistant';
                }

                if (!isset($message['content'])) {
                    $message['content'] = '';
                }

                return ['message' => $message];
            }, $response['choices']);

            return $response;
        }

        if (isset($response['message']) && is_array($response['message'])) {
            $message = $response['message'];
            $content = $message['content'] ?? $message['text'] ?? '';
            return ['choices' => [['message' => ['role' => $message['role'] ?? 'assistant', 'content' => $content]]]];
        }

        if (isset($response['text'])) {
            return ['choices' => [['message' => ['role' => 'assistant', 'content' => $response['text']]]]];
        }

        return ['choices' => [['message' => ['role' => 'assistant', 'content' => '']]]];
    }

    protected function sanitizeMessages(array $messages): array
    {
        $sanitized = [];
        $seenUser = false;

        foreach ($messages as $message) {
            $role = $message['role'] ?? 'user';
            $content = trim($message['content'] ?? $message['text'] ?? '');

            if ($role === 'system') {
                $sanitized[] = ['role' => 'system', 'content' => $content];
                continue;
            }

            if ($role === 'assistant' && !$seenUser) {
                continue;
            }

            if ($role === 'user') {
                $seenUser = true;
            }

            if ($content === '') {
                continue;
            }

            $sanitized[] = ['role' => $role, 'content' => $content];
        }

        return $sanitized;
    }

    public function providers()
    {
        return response()->json([
            'providers' => $this->aiProvider->getAvailableProviders(),
        ]);
    }
}

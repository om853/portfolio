<?php

namespace App\Services;

use App\Models\AiUsageLog;
use App\Services\AiProviders\AiProviderInterface;
use App\Services\AiProviders\DeepSeekProvider;
use App\Services\AiProviders\GeminiProvider;
use App\Services\AiProviders\GrokProvider;
use App\Services\AiProviders\TogetherProvider;
use App\Services\AiProviders\HuggingFaceProvider;
use App\Services\AiProviders\ConversationMockHelper;

class AiProviderService
{
    protected array $providers = [];

    protected ApiKeyRotationService $rotationService;

    public function __construct(ApiKeyRotationService $rotationService)
    {
        $this->rotationService = $rotationService;

        $this->providers = [
            'deepseek' => new DeepSeekProvider(),
            'gemini' => new GeminiProvider(),
            'grok' => new GrokProvider(),
            'together' => new TogetherProvider(),
            'huggingface' => new HuggingFaceProvider(),
        ];
    }

    public function getProvider(?string $name = null): AiProviderInterface
    {
        $name = $name ?? config('ai.default_provider', 'deepseek');

        if (!isset($this->providers[$name])) {
            throw new \InvalidArgumentException("Unknown AI provider: {$name}");
        }

        return $this->providers[$name];
    }

    public function getAvailableProviders(): array
    {
        return array_keys($this->providers);
    }

    public function chat(string $provider, array $messages, array $options = []): array
    {
        $providerInstance = $this->getProvider($provider);
        $keyModels = $this->rotationService->getAvailableKeyModels($provider);
        $lastException = null;

        foreach ($keyModels as $keyModel) {
            $options['api_key'] = $keyModel->key;

            try {
                $result = $this->attemptChat($provider, $providerInstance, $messages, $options);
                if ($this->isEmptyResponse($result)) {
                    throw new \RuntimeException('Empty response from provider');
                }
                $keyModel->incrementUsage();
                return $result;
            } catch (\Exception $e) {
                $lastException = $e;
            }
        }

        $envKeyName = strtoupper($provider) . '_API_KEY';
        $envKey = env($envKeyName);
        if ($envKey) {
            $options['api_key'] = $envKey;
            try {
                $result = $this->attemptChat($provider, $providerInstance, $messages, $options);
                if ($this->isEmptyResponse($result)) {
                    throw new \RuntimeException('Empty response from provider');
                }
                return $result;
            } catch (\Exception $e) {
                $lastException = $e;
            }
        }

        if (in_array($provider, ['deepseek', 'gemini'], true)) {
            return $this->buildMockResponse($provider, $messages);
        }

        if ($provider !== 'deepseek' && isset($this->providers['deepseek'])) {
            try {
                return $this->chat('deepseek', $messages, $options);
            } catch (\Exception $e) {
                $lastException = $e;
            }
        }

        throw $lastException ?? new \RuntimeException('No API keys available for provider: ' . $provider);
    }

    protected function isEmptyResponse(array $result): bool
    {
        return $this->extractContent($result) === '';
    }

    protected function extractContent(array $result): string
    {
        $content = $result['choices'][0]['message']['content']
            ?? $result['choices'][0]['message']['text']
            ?? $result['text']
            ?? '';

        if (is_array($content)) {
            $content = collect($content)
                ->map(fn ($part) => is_string($part) ? $part : ($part['text'] ?? ''))
                ->join('');
        }

        return trim((string) $content);
    }

    protected function buildMockResponse(string $provider, array $messages): array
    {
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
            'model' => $provider . '-mock',
        ];
    }

    protected function attemptChat(string $provider, AiProviderInterface $providerInstance, array $messages, array $options): array
    {
        $startTime = microtime(true);

        try {
            $result = $providerInstance->chat($messages, $options);
            $latency = (int) ((microtime(true) - $startTime) * 1000);
            $this->logUsage($provider, $result, $latency, false);
            return $result;
        } catch (\Exception $e) {
            $latency = (int) ((microtime(true) - $startTime) * 1000);
            $this->logUsage($provider, ['error' => $e->getMessage()], $latency, true, $e->getMessage());
            throw $e;
        }
    }

    protected function logUsage(string $provider, array $response, int $latencyMs, bool $isError, ?string $errorMessage = null): void
    {
        $model = $response['model'] ?? null;
        if (!$model && isset($response['choices'][0])) {
            $model = 'chat';
        }
        $model = $model ?? 'unknown';

        $tokensIn = $response['usage']['prompt_tokens'] ?? 0;
        $tokensOut = $response['usage']['completion_tokens'] ?? 0;

        $costRates = [
            'deepseek' => 0.0000005,
            'gemini' => 0.00000025,
            'grok' => 0.000002,
            'together' => 0.0000006,
            'huggingface' => 0.0000001,
        ];
        $rate = $costRates[$provider] ?? 0.000001;
        $cost = ($tokensIn + $tokensOut) * $rate;

        AiUsageLog::create([
            'provider' => $provider,
            'model' => $model,
            'tokens_in' => $tokensIn,
            'tokens_out' => $tokensOut,
            'cost' => $cost,
            'latency_ms' => $latencyMs,
            'is_error' => $isError,
            'error_message' => $errorMessage,
        ]);
    }

    public function getProviderNames(): array
    {
        $names = [];
        foreach ($this->providers as $name => $provider) {
            $names[] = $name;
        }
        return $names;
    }

    public function getUsageStats(): array
    {
        return [
            'total_requests' => AiUsageLog::count(),
            'total_error_requests' => AiUsageLog::where('is_error', true)->count(),
            'total_tokens_in' => AiUsageLog::sum('tokens_in'),
            'total_tokens_out' => AiUsageLog::sum('tokens_out'),
            'total_cost' => AiUsageLog::sum('cost'),
            'average_latency_ms' => AiUsageLog::avg('latency_ms'),
            'usage_by_provider' => AiUsageLog::select('provider', \DB::raw('count(*) as count'), \DB::raw('sum(tokens_in + tokens_out) as total_tokens'), \DB::raw('sum(cost) as total_cost'))
                ->groupBy('provider')
                ->get(),
            'recent_errors' => AiUsageLog::where('is_error', true)->latest()->limit(10)->get(),
        ];
    }
}

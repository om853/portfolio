<?php

namespace App\Services;

use App\Models\ApiKey;
use Illuminate\Support\Facades\Log;

class ApiKeyRotationService
{
    public function getNextKey(string $provider = 'deepseek', string $type = null): ?ApiKey
    {
        $query = ApiKey::available($provider);

        if ($type) {
            $query->where('type', $type);
        }

        $key = $query
            ->orderByDesc('priority')
            ->orderByDesc('id')
            ->first();

        if (!$key) {
            Log::warning("No available API key found for provider: {$provider}" . ($type ? " type: {$type}" : ''));
            return null;
        }

        return $key;
    }

    public function getAvailableKeyModels(string $provider = 'deepseek'): \Illuminate\Support\Collection
    {
        $static = ApiKey::available($provider)
            ->where('type', 'static')
            ->orderByDesc('priority')
            ->orderByDesc('id')
            ->get();

        $rotation = ApiKey::available($provider)
            ->where('type', 'rotation')
            ->orderByDesc('priority')
            ->orderByDesc('id')
            ->get();

        return $static->concat($rotation);
    }

    public function getKeyForRequest(string $provider = 'deepseek'): ?string
    {
        $apiKey = $this->getNextKey($provider, 'static');

        if (!$apiKey) {
            $apiKey = $this->getNextKey($provider, 'rotation');
        }

        if (!$apiKey) {
            return null;
        }

        $apiKey->incrementUsage();

        return $apiKey->key;
    }

    public function testKey(string $keyValue): array
    {
        $apiKey = ApiKey::where('key', $keyValue)->first();

        if (!$apiKey) {
            return ['valid' => false, 'message' => 'Key not found in database'];
        }

        return [
            'valid' => $apiKey->isAvailable(),
            'provider' => $apiKey->provider,
            'type' => $apiKey->type,
            'label' => $apiKey->label,
            'is_active' => $apiKey->is_active,
            'is_expired' => $apiKey->isExpired(),
            'remaining_daily' => $apiKey->getRemainingDaily(),
            'remaining_monthly' => $apiKey->getRemainingMonthly(),
            'daily_used' => $apiKey->daily_used,
            'daily_limit' => $apiKey->daily_limit,
            'monthly_used' => $apiKey->monthly_used,
            'monthly_limit' => $apiKey->monthly_limit,
            'last_used_at' => $apiKey->last_used_at,
            'expires_at' => $apiKey->expires_at,
        ];
    }

    public function rotateKeys(): array
    {
        $rotated = [];
        $keys = ApiKey::rotation()->where('is_active', true)->get();

        foreach ($keys as $key) {
            if (!$key->isAvailable()) {
                $key->update(['is_active' => false]);
                $rotated[] = [
                    'id' => $key->id,
                    'label' => $key->label,
                    'reason' => 'Limit reached or expired, auto-rotated'
                ];
            }
        }

        return $rotated;
    }

    public function resetDailyLimits(): void
    {
        ApiKey::where('daily_reset_at', '<=', now())
            ->update([
                'daily_used' => 0,
                'daily_reset_at' => null,
            ]);
    }

    public function resetMonthlyLimits(): void
    {
        ApiKey::where('monthly_reset_at', '<=', now())
            ->update([
                'monthly_used' => 0,
                'monthly_reset_at' => null,
            ]);
    }

    public function getStats(): array
    {
        return [
            'total_keys' => ApiKey::count(),
            'active_keys' => ApiKey::where('is_active', true)->count(),
            'expired_keys' => ApiKey::where('expires_at', '<=', now())->count(),
            'static_keys' => ApiKey::where('type', 'static')->count(),
            'rotation_keys' => ApiKey::where('type', 'rotation')->count(),
            'keys_by_provider' => ApiKey::select('provider', \DB::raw('count(*) as count'))
                ->groupBy('provider')
                ->pluck('count', 'provider'),
        ];
    }
}

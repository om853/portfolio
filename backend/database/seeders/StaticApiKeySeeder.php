<?php

namespace Database\Seeders;

use App\Models\ApiKey;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class StaticApiKeySeeder extends Seeder
{
    public function run(): void
    {
        ApiKey::create([
            'provider' => 'deepseek',
            'type' => 'static',
            'key' => 'sk-deepseek-seed-placeholder',
            'label' => 'Primary DeepSeek Key',
            'daily_limit' => 1000,
            'monthly_limit' => 30000,
            'daily_used' => 0,
            'monthly_used' => 0,
            'expires_at' => Carbon::now()->addYear(),
            'is_active' => true,
            'priority' => 100,
            'notes' => 'Replace with your real DeepSeek API key',
        ]);

        ApiKey::create([
            'provider' => 'deepseek',
            'type' => 'rotation',
            'key' => 'sk-deepseek-rotation-placeholder',
            'label' => 'DeepSeek Rotation Key',
            'daily_limit' => 500,
            'monthly_limit' => 15000,
            'daily_used' => 0,
            'monthly_used' => 0,
            'is_active' => true,
            'priority' => 50,
            'notes' => 'Backup rotation key for fallback',
        ]);

        ApiKey::create([
            'provider' => 'gemini',
            'type' => 'rotation',
            'key' => 'gemini-seed-placeholder',
            'label' => 'Gemini Free Tier Key',
            'daily_limit' => 1500,
            'monthly_limit' => 50000,
            'daily_used' => 0,
            'monthly_used' => 0,
            'is_active' => true,
            'priority' => 40,
            'notes' => 'Replace with your real Gemini API key (free tier available)',
        ]);
    }
}

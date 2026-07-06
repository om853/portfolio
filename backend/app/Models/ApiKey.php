<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ApiKey extends Model
{
    protected $fillable = [
        'provider', 'type', 'key', 'label', 'daily_limit', 'monthly_limit',
        'daily_used', 'monthly_used', 'daily_reset_at', 'monthly_reset_at',
        'last_used_at', 'expires_at', 'is_active', 'priority', 'notes'
    ];

    protected $casts = [
        'daily_limit' => 'integer',
        'monthly_limit' => 'integer',
        'daily_used' => 'integer',
        'monthly_used' => 'integer',
        'is_active' => 'boolean',
        'expires_at' => 'datetime',
        'daily_reset_at' => 'datetime',
        'monthly_reset_at' => 'datetime',
        'last_used_at' => 'datetime',
    ];

    public function scopeAvailable($query, $provider = null)
    {
        $now = Carbon::now();
        return $query->where('is_active', true)
            ->where(function ($q) use ($now) {
                $q->whereNull('expires_at')
                  ->orWhere('expires_at', '>', $now);
            })
            ->when($provider, function ($q) use ($provider) {
                $q->where('provider', $provider);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('daily_reset_at')
                  ->orWhere('daily_reset_at', '<', $now)
                  ->orWhere('daily_reset_at', '>=', $now);
            })
            ->where(function ($q) use ($now) {
                $q->whereNull('monthly_reset_at')
                  ->orWhere('monthly_reset_at', '<', $now)
                  ->orWhere('monthly_reset_at', '>=', $now);
            });
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function isDailyLimitReached(): bool
    {
        if (!$this->daily_reset_at || $this->daily_reset_at->isPast()) {
            return false;
        }
        return $this->daily_used >= $this->daily_limit;
    }

    public function isMonthlyLimitReached(): bool
    {
        if (!$this->monthly_reset_at || $this->monthly_reset_at->isPast()) {
            return false;
        }
        return $this->monthly_used >= $this->monthly_limit;
    }

    public function isAvailable(): bool
    {
        if (!$this->is_active) return false;
        if ($this->isExpired()) return false;
        if ($this->isDailyLimitReached()) return false;
        if ($this->isMonthlyLimitReached()) return false;
        return true;
    }

    public function incrementUsage(): void
    {
        $now = Carbon::now();

        if (!$this->daily_reset_at || $this->daily_reset_at->isPast()) {
            $this->update([
                'daily_used' => 1,
                'daily_reset_at' => $now->copy()->endOfDay(),
            ]);
        } else {
            $this->increment('daily_used');
        }

        if (!$this->monthly_reset_at || $this->monthly_reset_at->isPast()) {
            $this->update([
                'monthly_used' => 1,
                'monthly_reset_at' => $now->copy()->endOfMonth(),
            ]);
        } else {
            $this->increment('monthly_used');
        }

        $this->update(['last_used_at' => $now]);
    }

    public function getRemainingDaily(): int
    {
        if (!$this->daily_reset_at || $this->daily_reset_at->isPast()) {
            return $this->daily_limit;
        }
        return max(0, $this->daily_limit - $this->daily_used);
    }

    public function getRemainingMonthly(): int
    {
        if (!$this->monthly_reset_at || $this->monthly_reset_at->isPast()) {
            return $this->monthly_limit;
        }
        return max(0, $this->monthly_limit - $this->monthly_used);
    }

    public function isStatic(): bool
    {
        return $this->type === 'static';
    }

    public function scopeStatic($query)
    {
        return $query->where('type', 'static');
    }

    public function scopeRotation($query)
    {
        return $query->where('type', 'rotation');
    }
}
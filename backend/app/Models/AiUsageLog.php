<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiUsageLog extends Model
{
    protected $fillable = [
        'provider', 'model', 'tokens_in', 'tokens_out',
        'cost', 'latency_ms', 'is_error', 'error_message'
    ];

    protected $casts = [
        'is_error' => 'boolean',
        'cost' => 'decimal:6',
    ];
}

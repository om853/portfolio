<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'budget',
        'timeline',
        'requirements',
        'status',
        'notes',
        'source',
        'ai_conversation_id',
    ];
}

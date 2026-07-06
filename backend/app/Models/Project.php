<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'title', 'title_ar', 'type', 'description', 'description_ar',
        'image', 'photos', 'video', 'link', 'tech_stack',
        'live_demo', 'github', 'is_featured', 'views',
    ];

    protected $casts = [
        'photos' => 'array',
        'tech_stack' => 'array',
        'is_featured' => 'boolean',
        'views' => 'integer',
    ];
}

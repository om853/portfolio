<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageHit extends Model
{
    protected $fillable = ['path', 'ip_address', 'user_agent'];
}

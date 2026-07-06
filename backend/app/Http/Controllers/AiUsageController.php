<?php

namespace App\Http\Controllers;

use App\Services\AiProviderService;
use Illuminate\Http\Request;

class AiUsageController extends Controller
{
    protected AiProviderService $aiProvider;

    public function __construct(AiProviderService $aiProvider)
    {
        $this->aiProvider = $aiProvider;
    }

    public function stats()
    {
        return response()->json($this->aiProvider->getUsageStats());
    }
}

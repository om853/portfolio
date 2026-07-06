<?php

namespace App\Http\Controllers;

use App\Models\ApiKey;
use App\Services\ApiKeyRotationService;
use Illuminate\Http\Request;

class ApiKeyController extends Controller
{
    protected $rotationService;

    public function __construct(ApiKeyRotationService $rotationService)
    {
        $this->rotationService = $rotationService;
    }

    public function index()
    {
        return response()->json(ApiKey::orderByDesc('priority')->orderByDesc('id')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'provider' => 'required|string|max:50',
            'type' => 'nullable|string|in:static,rotation',
            'key' => 'required|string',
            'label' => 'nullable|string|max:255',
            'daily_limit' => 'nullable|integer|min:1',
            'monthly_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after:now',
            'is_active' => 'boolean',
            'priority' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $validated['type'] = $validated['type'] ?? 'rotation';
        $apiKey = ApiKey::create($validated);
        return response()->json($apiKey, 201);
    }

    public function show(ApiKey $apiKey)
    {
        $data = $apiKey->toArray();
        $data['remaining_daily'] = $apiKey->getRemainingDaily();
        $data['remaining_monthly'] = $apiKey->getRemainingMonthly();
        $data['is_available'] = $apiKey->isAvailable();
        return response()->json($data);
    }

    public function update(Request $request, ApiKey $apiKey)
    {
        $validated = $request->validate([
            'provider' => 'string|max:50',
            'type' => 'nullable|string|in:static,rotation',
            'key' => 'string',
            'label' => 'nullable|string|max:255',
            'daily_limit' => 'nullable|integer|min:1',
            'monthly_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date',
            'is_active' => 'boolean',
            'priority' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $apiKey->update($validated);
        return response()->json($apiKey);
    }

    public function destroy(ApiKey $apiKey)
    {
        $apiKey->delete();
        return response()->json(null, 204);
    }

    public function stats()
    {
        return response()->json($this->rotationService->getStats());
    }

    public function testKey(Request $request)
    {
        $request->validate(['key' => 'required|string']);

        $result = $this->rotationService->testKey($request->input('key'));

        return response()->json($result);
    }

    public function rotate()
    {
        $rotated = $this->rotationService->rotateKeys();
        return response()->json([
            'message' => count($rotated) . ' key(s) rotated',
            'rotated' => $rotated,
        ]);
    }

    public function resetLimits(Request $request)
    {
        $type = $request->input('type', 'daily');
        
        if ($type === 'daily' || $type === 'all') {
            $this->rotationService->resetDailyLimits();
        }
        if ($type === 'monthly' || $type === 'all') {
            $this->rotationService->resetMonthlyLimits();
        }

        return response()->json(['message' => " {$type} limits reset successfully"]);
    }
}
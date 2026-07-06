<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LeadController extends Controller
{
    public function index()
    {
        return response()->json(Lead::orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'budget' => 'nullable|string|max:255',
            'timeline' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'status' => 'nullable|string|in:new,contacted,qualified,proposal_sent,won,lost',
            'notes' => 'nullable|string',
            'source' => 'nullable|string|max:255',
            'ai_conversation_id' => 'nullable|string|max:255',
        ]);

        $lead = Lead::create($validated);
        
        Log::info('New lead created from ' . ($validated['source'] ?? 'website'));

        return response()->json($lead, 201);
    }

    public function show(Lead $lead)
    {
        return response()->json($lead);
    }

    public function update(Request $request, Lead $lead)
    {
        $validated = $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'budget' => 'nullable|string|max:255',
            'timeline' => 'nullable|string|max:255',
            'requirements' => 'nullable|string',
            'status' => 'nullable|string|in:new,contacted,qualified,proposal_sent,won,lost',
            'notes' => 'nullable|string',
        ]);

        $lead->update($validated);

        return response()->json($lead);
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(['message' => 'Lead deleted']);
    }
}

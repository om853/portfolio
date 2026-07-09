<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Services\ResendService;
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

        try {
            $resend = app(ResendService::class);
            $html = $this->buildLeadEmailHtml($lead, 'New Lead Received');
            $resend->sendEmail(
                'mrmhmdalshhatly@gmail.com',
                "New Lead: {$lead->name} ({$lead->company})",
                $html
            );
        } catch (\Exception $e) {
            Log::error('Lead notification email failed: ' . $e->getMessage());
        }

        Log::info('New lead created from ' . ($validated['source'] ?? 'website'));

        return response()->json($lead, 201);
    }

    public function show(Lead $lead)
    {
        return response()->json($lead);
    }

    public function update(Request $request, Lead $lead)
    {
        $original = $lead->replicate();

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

        try {
            $changes = [];
            foreach ($validated as $field => $value) {
                if ($original->$field != $value) {
                    $changes[$field] = ['from' => $original->$field, 'to' => $value];
                }
            }
            if (!empty($changes)) {
                $resend = app(ResendService::class);
                $html = $this->buildLeadUpdateEmailHtml($lead, $changes);
                $resend->sendEmail(
                    'mrmhmdalshhatly@gmail.com',
                    "Lead Updated: {$lead->name} ({$lead->company})",
                    $html
                );
            }
        } catch (\Exception $e) {
            Log::error('Lead update notification email failed: ' . $e->getMessage());
        }

        return response()->json($lead);
    }

    public function destroy(Lead $lead)
    {
        $lead->delete();
        return response()->json(['message' => 'Lead deleted']);
    }

    private function buildLeadEmailHtml($lead, $title)
    {
        $fields = [
            'Name' => $lead->name,
            'Email' => $lead->email,
            'Phone' => $lead->phone,
            'Company' => $lead->company,
            'Budget' => $lead->budget,
            'Timeline' => $lead->timeline,
            'Requirements' => $lead->requirements,
            'Source' => $lead->source,
        ];
        $rows = '';
        foreach ($fields as $label => $value) {
            if ($value) {
                $rows .= "<tr><td style='padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:#333;width:140px'>{$label}</td><td style='padding:8px 12px;border-bottom:1px solid #eee;color:#555'>{$value}</td></tr>";
            }
        }
        $date = now()->format('F j, Y g:i A');
        return <<<HTML
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:linear-gradient(135deg,#1a1a1a,#333);padding:32px;text-align:center">
                <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:-0.5px">{$title}</h1>
                <p style="color:#aaa;margin:8px 0 0;font-size:13px">Received {$date}</p>
            </div>
            <div style="padding:24px">
                <table style="width:100%;border-collapse:collapse;font-size:14px">{$rows}</table>
            </div>
        </div>
        HTML;
    }

    private function buildLeadUpdateEmailHtml($lead, $changes)
    {
        $date = now()->format('F j, Y g:i A');
        $rows = '';
        foreach ($changes as $field => $change) {
            $label = ucwords(str_replace('_', ' ', $field));
            $from = $change['from'] ?? '(empty)';
            $to = $change['to'] ?? '(empty)';
            $rows .= <<<ROW
            <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;color:#333;width:140px;vertical-align:top">{$label}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #eee;vertical-align:top">
                    <span style="color:#999;text-decoration:line-through">{$from}</span>
                    <span style="color:#e11d48;margin:0 6px">→</span>
                    <span style="color:#059669;font-weight:600">{$to}</span>
                </td>
            </tr>
            ROW;
        }
        $leadInfo = <<<INFO
        <div style="margin-top:16px;padding-top:16px;border-top:1px solid #eee;font-size:13px;color:#666">
            Lead: <strong>{$lead->name}</strong> &middot; {$lead->company} &middot; {$lead->email}
        </div>
        INFO;
        return <<<HTML
        <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
            <div style="background:linear-gradient(135deg,#1a1a1a,#333);padding:32px;text-align:center">
                <h1 style="color:#fff;margin:0;font-size:20px;letter-spacing:-0.5px">Lead Updated</h1>
                <p style="color:#aaa;margin:8px 0 0;font-size:13px">{$date}</p>
            </div>
            <div style="padding:24px">
                <table style="width:100%;border-collapse:collapse;font-size:14px">{$rows}</table>
                {$leadInfo}
            </div>
        </div>
        HTML;
    }
}

<?php

namespace App\Services\AiProviders;

class ConversationMockHelper
{
    public static function respond(array $messages): string
    {
        $userMessages = array_values(array_filter($messages, fn ($m) => ($m['role'] ?? '') === 'user'));
        $count = count($userMessages);
        $last = strtolower(trim($userMessages[$count - 1]['content'] ?? ''));

        if ($count <= 1) {
            return "Hello! I'm Omar's AI assistant. I'd love to help you outline your project.\n\nMay I start with your name?";
        }

        if ($count === 2) {
            return "Nice to meet you! What is your estimated budget for this project? (e.g. under \$1k, \$1k–5k, \$5k+)";
        }

        if ($count === 3) {
            return "Thanks! Please share your WhatsApp or phone number so Omar can reach you.";
        }

        if ($count === 4) {
            return "Great. Tell me about your project — what do you need built, key features, and any deadlines?";
        }

        $name = trim($userMessages[0]['content'] ?? 'Client');
        $budget = trim($userMessages[1]['content'] ?? 'Not specified');
        $phone = trim($userMessages[2]['content'] ?? 'Not provided');
        $requirements = trim($userMessages[3]['content'] ?? $last);

        $summary = "Here is a professional summary of your project:\n\n"
            . "You are looking for: {$requirements}. "
            . "With a budget of {$budget}, Omar can propose a tailored plan and timeline. "
            . "He will contact you at {$phone} to discuss next steps.";

        $leadJson = json_encode([
            'name' => $name,
            'phone' => $phone,
            'budget' => $budget,
            'requirements' => $requirements,
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

        return "{$summary}\n\n[LEAD_DATA]{$leadJson}[/LEAD_DATA]";
    }
}

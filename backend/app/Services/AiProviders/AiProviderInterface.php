<?php

namespace App\Services\AiProviders;

interface AiProviderInterface
{
    public function getName(): string;
    public function chat(array $messages, array $options = []): array;
}

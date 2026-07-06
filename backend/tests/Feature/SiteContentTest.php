<?php

namespace Tests\Feature;

use Tests\TestCase;

class SiteContentTest extends TestCase
{
    public function test_site_content_endpoint_returns_structured_content(): void
    {
        $response = $this->getJson('/api/site-content/');

        $response->assertOk()
            ->assertJsonStructure([
                'experiences',
                'services',
                'stats',
                'certificates',
            ]);
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TestMailConfiguration extends Command
{
    protected $signature = 'mail:test {email : The email address to send the test email to}';
    protected $description = 'Validate mail configuration and send a test email';

    public function handle()
    {
        $email = $this->argument('email');
        $this->info('Testing mail configuration...');

        $this->line('Host: ' . config('mail.mailers.smtp.host'));
        $this->line('Port: ' . config('mail.mailers.smtp.port'));
        $this->line('Encryption: ' . config('mail.mailers.smtp.encryption'));
        $this->line('Timeout: ' . config('mail.mailers.smtp.timeout'));

        try {
            Mail::raw('This is a test email from your portfolio backend. If you see this, SMTP is working!', function ($message) use ($email) {
                $message->to($email)->subject('SMTP Test - Portfolio Backend');
            });

            $this->info('Success! Test email sent to ' . $email);
            Log::channel('mail')->info('Test mail sent successfully to ' . $email);
        } catch (\Exception $e) {
            $this->error('Failed to send test email: ' . $e->getMessage());
            Log::channel('mail')->error('Test mail failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return Command::FAILURE;
        }

        return Command::SUCCESS;
    }
}

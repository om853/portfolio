<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class LoginNotification extends Mailable
{
    use Queueable, SerializesModels;

    public string $userName;
    public string $userEmail;
    public string $ipAddress;
    public string $userAgent;

    public function __construct(string $userName, string $userEmail, string $ipAddress, string $userAgent)
    {
        $this->userName = $userName;
        $this->userEmail = $userEmail;
        $this->ipAddress = $ipAddress;
        $this->userAgent = $userAgent;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Dashboard Login: {$this->userName} ({$this->userEmail})",
        );
    }

    public function content(): \Illuminate\Mail\Mailables\Content
    {
        return new \Illuminate\Mail\Mailables\Content(
            htmlString: $this->buildHtml(),
        );
    }

    private function buildHtml(): string
    {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: 'Inter', Arial, sans-serif; background-color: #f5f5f5; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
                .header { background: #1a1a1a; padding: 32px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
                .body { padding: 32px; color: #333333; line-height: 1.7; }
                .body h2 { margin: 0 0 16px 0; font-size: 18px; }
                .field { margin-bottom: 12px; }
                .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; font-weight: 700; }
                .field-value { font-size: 15px; color: #1a1a1a; margin-top: 2px; }
                .divider { border: none; border-top: 1px solid #eee; margin: 20px 0; }
                .footer { padding: 24px 32px; background: #0e0e0e; color: #adaaaa; font-size: 12px; text-align: center; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>Dashboard Login</h1>
                </div>
                <div class='body'>
                    <h2>A login to your dashboard was detected</h2>
                    <div class='field'>
                        <div class='field-label'>User</div>
                        <div class='field-value'>{$this->userName} ({$this->userEmail})</div>
                    </div>
                    <div class='field'>
                        <div class='field-label'>Time</div>
                        <div class='field-value'>" . now()->format('F j, Y g:i A e') . "</div>
                    </div>
                    <div class='field'>
                        <div class='field-label'>IP Address</div>
                        <div class='field-value'>{$this->ipAddress}</div>
                    </div>
                    <div class='field'>
                        <div class='field-label'>Browser / Device</div>
                        <div class='field-value' style='font-size: 12px; word-break: break-all;'>{$this->userAgent}</div>
                    </div>
                </div>
                <div class='footer'>
                    <p>&copy; " . date('Y') . " Omar Mohamed Elshahat</p>
                </div>
            </div>
        </body>
        </html>";
    }
}

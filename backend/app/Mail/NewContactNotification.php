<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewContactNotification extends Mailable
{
    use Queueable, SerializesModels;

    public string $senderName;
    public string $senderEmail;
    public string $senderPhone;
    public string $messageBody;

    public function __construct(string $senderName, string $senderEmail, ?string $senderPhone, string $messageBody)
    {
        $this->senderName = $senderName;
        $this->senderEmail = $senderEmail;
        $this->senderPhone = $senderPhone ?? 'Not provided';
        $this->messageBody = $messageBody;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New Contact Message from {$this->senderName}",
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
                    <h1>New Contact Message</h1>
                </div>
                <div class='body'>
                    <h2>Someone contacted you via the portfolio</h2>
                    <div class='field'>
                        <div class='field-label'>Name</div>
                        <div class='field-value'>{$this->senderName}</div>
                    </div>
                    <div class='field'>
                        <div class='field-label'>Email</div>
                        <div class='field-value'>{$this->senderEmail}</div>
                    </div>
                    <div class='field'>
                        <div class='field-label'>Phone</div>
                        <div class='field-value'>{$this->senderPhone}</div>
                    </div>
                    <hr class='divider'>
                    <div class='field'>
                        <div class='field-label'>Message</div>
                        <div class='field-value'>{$this->messageBody}</div>
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

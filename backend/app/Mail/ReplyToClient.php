<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ReplyToClient extends Mailable
{
    use Queueable, SerializesModels;

    public string $clientName;
    public string $clientEmail;
    public $subject;
    public string $body;

    public function __construct(string $clientName, string $clientEmail, string $subject, string $body)
    {
        $this->clientName = $clientName;
        $this->clientEmail = $clientEmail;
        $this->subject = $subject;
        $this->body = $body;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->subject,
        );
    }

    public function content(): Content
    {
        return new Content(
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
                .body p { margin: 0 0 16px 0; }
                .footer { padding: 24px 32px; background: #0e0e0e; color: #adaaaa; font-size: 12px; text-align: center; }
                .footer a { color: #ffffff; text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1>OMAR | Full Stack Developer</h1>
                </div>
                <div class='body'>
                    <p>Hello <strong>{$this->clientName}</strong>,</p>
                    <p>{$this->body}</p>
                    <p>Best regards,<br><strong>Omar Mohamed Elshahat</strong><br>Full Stack Developer</p>
                </div>
                <div class='footer'>
                    <p>&copy; " . date('Y') . " Omar Mohamed Elshahat. All rights reserved.</p>
                    <p><a href='https://wa.me/201507044651'>WhatsApp</a> | <a href='mailto:mrmhmdalshhatly@gmail.com'>Email</a></p>
                </div>
            </div>
        </body>
        </html>";
    }
}
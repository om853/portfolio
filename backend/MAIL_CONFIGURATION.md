# Mail Configuration Guide (Railway Production)

## The Problem
Railway blocks outbound SMTP on port 587 (TLS), which is the default for many Laravel setups. This causes emails to time out or fail with connection errors in production, even if they work perfectly in local development.

## The Solution
To bypass this restriction, we use **Port 465** with **SSL** encryption.

### Required Environment Variables
Set these in your Railway Dashboard:

| Variable | Value | Note |
| :--- | :--- | :--- |
| `MAIL_MAILER` | `smtp` | Use SMTP transport |
| `MAIL_HOST` | `smtp.gmail.com` | Or your provider's host |
| `MAIL_PORT` | `465` | **Must be 465 for Railway** |
| `MAIL_ENCRYPTION` | `ssl` | **Must be ssl** |
| `MAIL_USERNAME` | `your-email@gmail.com` | Your SMTP username |
| `MAIL_PASSWORD` | `xxxx xxxx xxxx xxxx` | Your App Password |
| `MAIL_FROM_ADDRESS` | `your-email@gmail.com` | Sender email |
| `MAIL_FROM_NAME` | `Omar Mohamed` | Sender name |

### Configuration Changes
The following changes have been implemented in the code:
- `config/mail.php`: Updated default port to 465, encryption to `ssl`, and timeout to 30 seconds.
- `config/logging.php`: Added a dedicated `mail` logging channel for easier troubleshooting.
- `MailController.php`: Added detailed logging for all outgoing replies.

## Troubleshooting & Validation

### 1. Clear Config Cache
After updating environment variables in Railway, you MUST clear the config cache. Run this in the Railway shell:
```bash
php artisan config:cache
```

### 2. Run the Test Command
Use the built-in test command to verify the setup without relying on the frontend:
```bash
php artisan mail:test your-email@example.com
```

### 3. Check Mail Logs
If emails are still failing, check the dedicated mail log:
```bash
tail -f storage/logs/mail.log
```
The logs contain the exact SMTP configuration used and the full stack trace of any errors.

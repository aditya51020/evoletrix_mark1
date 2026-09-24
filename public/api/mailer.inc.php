<?php
/**
 * Thin wrapper around the vendored PHPMailer so endpoints don't touch
 * PHPMailer directly. Never throws — logs and returns false on failure,
 * so callers can save-then-notify without letting a broken SMTP config
 * turn into a failed user-facing submission.
 */

declare(strict_types=1);

require_once __DIR__ . '/lib/PHPMailer/Exception.php';
require_once __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/lib/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\Exception as PHPMailerException;
use PHPMailer\PHPMailer\PHPMailer;

function evx_send_mail(string $subject, string $htmlBody, ?string $replyToEmail = null, ?string $replyToName = null): bool
{
    $smtp = evx_config()['smtp'];
    $notifyTo = evx_config()['admin_notify_email'];

    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host = $smtp['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $smtp['user'];
        $mail->Password = $smtp['pass'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = (int) $smtp['port'];
        // PHPMailer's default is 300s. A hung/firewalled SMTP connection
        // must not hold the HTTP request (and the visitor's form) open
        // for five minutes — fail fast instead.
        $mail->Timeout = 10;

        // From is always the configured mailbox, never the submitter's
        // address (most SMTP providers reject or spam-flag mismatched
        // From domains anyway). The submitter's email only ever goes in
        // Reply-To, so hitting "Reply" in the inbox replies to them.
        $mail->setFrom($smtp['from_email'], $smtp['from_name']);
        $mail->addAddress($notifyTo);

        if ($replyToEmail !== null && filter_var($replyToEmail, FILTER_VALIDATE_EMAIL)) {
            $mail->addReplyTo($replyToEmail, $replyToName ?? '');
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $htmlBody));

        $mail->send();
        return true;
    } catch (PHPMailerException $e) {
        error_log('Evoletrix mail send failed: ' . $mail->ErrorInfo);
        return false;
    } catch (\Throwable $e) {
        error_log('Evoletrix mail send failed (unexpected): ' . $e->getMessage());
        return false;
    }
}

<?php

namespace App\Services;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class MailService
{
    public static function sendOtp($to, $otp)
    {
        $mail = new PHPMailer(true);

        try {
            // Server settings
            $mail->SMTPDebug  = 0; // Set to 2 for detailed logs if this still fails
            $mail->isSMTP();
            $mail->Host       = config('mail.mailers.smtp.host', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = config('mail.mailers.smtp.username');
            $mail->Password   = config('mail.mailers.smtp.password');
            
            // Map string 'ssl'/'tls' to PHPMailer constants
            $encryption = config('mail.mailers.smtp.encryption');
            if ($encryption === 'ssl') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }
            
            $mail->Port       = config('mail.mailers.smtp.port', 465);

            // Recipients
            $mail->setFrom(config('mail.from.address'), config('mail.from.name', 'Precision Fitness'));
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Your Verification Code - Precision Fitness';
            
            $mail->Body = view('emails.otp', ['otp' => $otp])->render();
            $mail->AltBody = "Your verification code is: {$otp}";

            $mail->send();
            return true;
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error("PHPMailer Error: " . $e->getMessage() . " | ErrorInfo: " . $mail->ErrorInfo);
            return false;
        }
    }
}

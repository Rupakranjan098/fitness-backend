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
            $mail->isSMTP();
            $mail->Host       = env('MAIL_HOST', 'smtp.gmail.com');
            $mail->SMTPAuth   = true;
            $mail->Username   = env('MAIL_USERNAME');
            $mail->Password   = env('MAIL_PASSWORD');
            $mail->SMTPSecure = env('MAIL_ENCRYPTION', 'tls');
            $mail->Port       = env('MAIL_PORT', 587);

            // Recipients
            $mail->setFrom(env('MAIL_FROM_ADDRESS'), env('MAIL_FROM_NAME', 'Precision Fitness'));
            $mail->addAddress($to);

            // Content
            $mail->isHTML(true);
            $mail->Subject = 'Your Verification Code - Precision Fitness';
            
            // Re-using the blade view for consistency, but rendering it to a string
            $mail->Body = view('emails.otp', ['otp' => $otp])->render();
            $mail->AltBody = "Your verification code is: {$otp}";

            $mail->send();
            return true;
        } catch (Exception $e) {
            \Illuminate\Support\Facades\Log::error("PHPMailer Error: {$mail->ErrorInfo}");
            return false;
        }
    }
}

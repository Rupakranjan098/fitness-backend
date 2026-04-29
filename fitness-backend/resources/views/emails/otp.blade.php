<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
            color: #1e293b;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 24px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0,0,0,0.05);
        }
        .header {
            background: linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%);
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            font-size: 24px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -1px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .title {
            font-size: 22px;
            font-weight: 700;
            margin-bottom: 12px;
            color: #0f172a;
        }
        .subtitle {
            font-size: 15px;
            color: #64748b;
            line-height: 24px;
            margin-bottom: 32px;
        }
        .otp-box {
            background: #f1f5f9;
            border-radius: 16px;
            padding: 24px;
            display: inline-block;
            margin-bottom: 32px;
        }
        .otp-code {
            font-size: 42px;
            font-weight: 900;
            letter-spacing: 12px;
            color: #0ea5e9;
            margin: 0;
        }
        .footer {
            padding: 24px;
            background: #f8fafc;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">EVO FIT</div>
        </div>
        <div class="content">
            <h1 class="title">Verify Your Email</h1>
            <p class="subtitle">Use the code below to complete your registration and start your athletic journey.</p>
            
            <div class="otp-box">
                <h2 class="otp-code">{{ $otp }}</h2>
            </div>
            
            <p class="subtitle" style="font-size: 13px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
        <div class="footer">
            &copy; {{ date('Y') }} Evo Fit. All rights reserved.
        </div>
    </div>
</body>
</html>

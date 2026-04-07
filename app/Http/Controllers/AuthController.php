<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class AuthController extends Controller
{
    public function register(Request $request) {
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'age' => 'nullable|integer',
            'gender' => 'nullable|string',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'phone' => 'nullable|string',
            'bio' => 'nullable|string',
            'goal' => 'nullable|string',
        ]);
        $user = User::create([...$data, 'password' => Hash::make($data['password'])]);
        
        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        \Illuminate\Support\Facades\Log::info("OTP for {$user->email} is {$otp}");
        
        // Send Email via SMTP
        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json(['message' => 'OTP sent to email', 'email' => $user->email]);
    }

    public function verifyOtp(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || $user->otp !== $request->otp || now()->greaterThan($user->otp_expires_at)) {
            throw ValidationException::withMessages(['otp' => ['Invalid or expired OTP.']]);
        }

        $user->otp = null;
        $user->otp_expires_at = null;
        $user->email_verified_at = now();
        $user->save();

        return response()->json(['user' => $user, 'token' => $user->createToken('auth_token')->plainTextToken]);
    }

    public function resendOtp(Request $request) {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return response()->json(['message' => 'User not found'], 44);
        }

        $otp = rand(100000, 999999);
        $user->otp = $otp;
        $user->otp_expires_at = now()->addMinutes(10);
        $user->save();

        Mail::to($user->email)->send(new OtpMail($otp));

        return response()->json(['message' => 'New OTP sent to email']);
    }

    public function me(Request $request) {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request) {
        $user = $request->user();
        $data = $request->validate([
            'name' => 'nullable|string',
            'phone' => 'nullable|string',
            'gender' => 'nullable|string',
            'dob' => 'nullable|date',
            'height' => 'nullable|numeric',
            'weight' => 'nullable|numeric',
            'age' => 'nullable|integer',
            // 'bio' => 'nullable|string',
            'goal' => 'nullable|string',
            'nation' => 'nullable|string',
        ]);

        $user->update($data);
        return response()->json(['message' => 'Profile updated successfully', 'user' => $user->fresh()]);
    }

    public function login(Request $request) {
        $request->validate(['email' => 'required|email', 'password' => 'required']);
        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => ['Invalid credentials.']]);
        }

        if (!$user->email_verified_at) {
            return response()->json([
                'message' => 'Email not verified. Please verify your email first.',
                'email' => $user->email,
                'verified' => false
            ], 403);
        }

        return response()->json(['user' => $user, 'token' => $user->createToken('auth_token')->plainTextToken]);
    }

    public function guestLogin(Request $request) {
        $uid = uniqid();
        $user = User::create([
            'name' => 'Guest_' . $uid,
            'email' => 'guest_' . $uid . '@anonymous.com',
            'password' => Hash::make(Str::random(16)),
        ]);
        return response()->json([
            'user' => $user,
            'token' => $user->createToken('auth_token')->plainTextToken
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Services\MailService;

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
            'profile_picture' => 'nullable|string', // Base64 string
        ]);

        // Handle profile picture
        if (!empty($data['profile_picture']) && strpos($data['profile_picture'], 'data:image') === 0) {
            $image_service = $this->saveBase64Image($data['profile_picture']);
            $data['profile_picture'] = $image_service;
        }

        $otp = rand(100000, 999999);
        $data['password'] = Hash::make($data['password']);
        $data['otp'] = $otp;

        // Store data in cache for 10 minutes instead of inserting into DB
        \Illuminate\Support\Facades\Cache::put('pending_user_' . $data['email'], $data, now()->addMinutes(10));

        \Illuminate\Support\Facades\Log::info("OTP for {$data['email']} is {$otp}");
        
        // Send Email via PHPMailer
        $sent = MailService::sendOtp($data['email'], $otp);

        if (!$sent) {
            return response()->json(['message' => 'Failed to send verification email. Please check your SMTP settings.'], 500);
        }

        return response()->json(['message' => 'OTP sent to email', 'email' => $data['email']]);
    }

    private function saveBase64Image($base64String) {
        try {
            $format = explode(',', $base64String);
            if (count($format) < 2) return null;
            
            $image = base64_decode($format[1]);
            $fileName = Str::random(20) . '.png';
            \Illuminate\Support\Facades\Storage::disk('public')->put('profiles/' . $fileName, $image);
            return '/storage/profiles/' . $fileName;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Image upload error: " . $e->getMessage());
            return null;
        }
    }

    public function verifyOtp(Request $request) {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string',
        ]);

        $cachedData = \Illuminate\Support\Facades\Cache::get('pending_user_' . $request->email);

        if (!$cachedData || $cachedData['otp'] != $request->otp) {
             throw ValidationException::withMessages(['otp' => ['Invalid or expired OTP.']]);
        }

        // OTP is correct - Now we "Insert" the data
        $user = User::create($cachedData);
        $user->email_verified_at = now();
        $user->save();

        // Clear cache
        \Illuminate\Support\Facades\Cache::forget('pending_user_' . $request->email);

        return response()->json(['user' => $user, 'token' => $user->createToken('auth_token')->plainTextToken]);
    }

    public function resendOtp(Request $request) {
        $request->validate(['email' => 'required|email']);
        
        $cachedData = \Illuminate\Support\Facades\Cache::get('pending_user_' . $request->email);
        
        if (!$cachedData) {
            return response()->json(['message' => 'No pending registration found for this email. Please register again.'], 404);
        }

        $otp = rand(100000, 999999);
        $cachedData['otp'] = $otp;
        \Illuminate\Support\Facades\Cache::put('pending_user_' . $request->email, $cachedData, now()->addMinutes(10));

        MailService::sendOtp($request->email, $otp);

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
            'goal' => 'nullable|string',
            'nation' => 'nullable|string',
            'profile_picture' => 'nullable|string',
            'fitness_level' => 'nullable|string',
            'training_location' => 'nullable|string',
            'equipment_type' => 'nullable|string',
            'equipment' => 'nullable|array',
            'areas_of_concern' => 'nullable|array',
            'days_per_week' => 'nullable|integer',
            'session_duration' => 'nullable|integer',
            'include_warmup' => 'nullable|boolean',
            'include_cooldown' => 'nullable|boolean',
            'include_cardio' => 'nullable|boolean',
        ]);

        if (!empty($data['profile_picture']) && strpos($data['profile_picture'], 'data:image') === 0) {
            $data['profile_picture'] = $this->saveBase64Image($data['profile_picture']);
        }

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

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

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
        return response()->json(['user' => $user, 'token' => $user->createToken('auth_token')->plainTextToken]);
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

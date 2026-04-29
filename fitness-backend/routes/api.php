<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BmiRecordController;
use App\Http\Controllers\NutritionLogController;

use App\Http\Controllers\SleepLogController;
use App\Http\Controllers\WorkoutLogController;
use App\Http\Controllers\WellnessLogController;
use App\Http\Controllers\OutdoorLogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DiscoverItemController;

Route::get('/discover-items', [DiscoverItemController::class, 'index']);
Route::post('/register', [AuthController::class , 'register']);
Route::post('/verify-otp', [AuthController::class , 'verifyOtp']);
Route::post('/resend-otp', [AuthController::class , 'resendOtp']);
Route::post('/login', [AuthController::class , 'login']);
Route::post('/guest-login', [AuthController::class , 'guestLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/hydration-logs', [DashboardController::class, 'updateHydration']);
    Route::get('/diet-plan', [DietPlanController::class, 'getPlan']);
    Route::apiResource('bmi-records', BmiRecordController::class)->only(['index', 'store']);
    Route::apiResource('nutrition-logs', NutritionLogController::class)->only(['index', 'store']);
    Route::apiResource('sleep-logs', SleepLogController::class)->only(['index', 'store']);
    Route::apiResource('workout-logs', WorkoutLogController::class)->only(['index', 'store']);
    Route::apiResource('wellness-logs', WellnessLogController::class)->only(['index', 'store']);
    Route::apiResource('outdoor-logs', OutdoorLogController::class)->only(['index', 'store']);
});

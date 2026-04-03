<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BmiRecordController;
use App\Http\Controllers\NutritionLogController;

use App\Http\Controllers\DietPlanController;

Route::post('/register', [AuthController::class , 'register']);
Route::post('/login', [AuthController::class , 'login']);
Route::post('/guest-login', [AuthController::class , 'guestLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/update-profile', [AuthController::class, 'updateProfile']);
    Route::get('/diet-plan', [DietPlanController::class, 'getPlan']);
    Route::apiResource('bmi-records', BmiRecordController::class)->only(['index', 'store']);
    Route::apiResource('nutrition-logs', NutritionLogController::class)->only(['index', 'store']);
});

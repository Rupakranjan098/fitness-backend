<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BmiRecordController;
use App\Http\Controllers\NutritionLogController;

Route::post('/register', [AuthController::class , 'register']);
Route::post('/login', [AuthController::class , 'login']);
Route::post('/guest-login', [AuthController::class , 'guestLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('bmi-records', BmiRecordController::class)->only(['index', 'store']);
    Route::apiResource('nutrition-logs', NutritionLogController::class)->only(['index', 'store']);
});

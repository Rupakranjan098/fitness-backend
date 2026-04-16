<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $today = Carbon::today()->toDateString();
        
        $hydration = $user->hydrationLogs()->where('log_date', $today)->first();
        $recentWorkout = $user->outdoorLogs()->latest('log_date')->first();

        return response()->json([
            'user' => $user,
            'hydration' => $hydration ? $hydration->glasses : 0,
            'recent_workout' => $recentWorkout
        ]);
    }

    public function updateHydration(Request $request)
    {
        $request->validate([
            'glasses' => 'required|integer|min:0'
        ]);

        $user = $request->user();
        $today = Carbon::today()->toDateString();

        $hydration = $user->hydrationLogs()->updateOrCreate(
            ['log_date' => $today],
            ['glasses' => $request->glasses]
        );

        return response()->json([
            'message' => 'Hydration updated',
            'hydration' => $hydration->glasses
        ]);
    }
}

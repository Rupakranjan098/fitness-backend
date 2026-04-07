<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WorkoutLogController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->workoutLogs()->orderBy('log_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'exercise_name' => 'nullable|string',
            'duration_minutes' => 'required|integer',
            'calories_burned' => 'nullable|integer',
            'log_date' => 'required|date',
        ]);

        $log = $request->user()->workoutLogs()->create($validated);
        return response()->json(['message' => 'Workout saved', 'log' => $log]);
    }
}

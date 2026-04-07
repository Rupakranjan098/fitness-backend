<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SleepLogController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->sleepLogs()->orderBy('log_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'duration_minutes' => 'required|integer',
            'quality' => 'nullable|string',
            'log_date' => 'required|date',
            'start_time' => 'nullable',
            'end_time' => 'nullable',
        ]);

        $log = $request->user()->sleepLogs()->create($validated);
        return response()->json(['message' => 'Sleep log saved', 'log' => $log]);
    }
}

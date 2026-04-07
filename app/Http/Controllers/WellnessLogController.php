<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class WellnessLogController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->wellnessLogs()->orderBy('log_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'duration_minutes' => 'required|integer',
            'log_date' => 'required|date',
        ]);

        $log = $request->user()->wellnessLogs()->create($validated);
        return response()->json(['message' => 'Wellness activity saved', 'log' => $log]);
    }
}

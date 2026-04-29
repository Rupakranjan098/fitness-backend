<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class OutdoorLogController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->outdoorLogs()->orderBy('log_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'distance_km' => 'required|numeric',
            'duration_seconds' => 'required|integer',
            'average_speed' => 'nullable|numeric',
            'path_coordinates' => 'nullable|array',
            'log_date' => 'required|date',
        ]);

        $log = $request->user()->outdoorLogs()->create($validated);
        return response()->json(['message' => 'Outdoor activity saved', 'log' => $log]);
    }
}

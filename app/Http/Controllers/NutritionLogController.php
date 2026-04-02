<?php

namespace App\Http\Controllers;

use App\Models\NutritionLog;
use Illuminate\Http\Request;

class NutritionLogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $request->user()->nutritionLogs()->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'calories' => 'required|integer',
            'water_intake' => 'required|integer',
            'log_date' => 'required|date',
        ]);
        return $request->user()->nutritionLogs()->create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(NutritionLog $nutritionLog)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, NutritionLog $nutritionLog)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NutritionLog $nutritionLog)
    {
        //
    }
}

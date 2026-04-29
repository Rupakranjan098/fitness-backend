<?php

namespace App\Http\Controllers;

use App\Models\BmiRecord;
use Illuminate\Http\Request;

class BmiRecordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $request->user()->bmiRecords()->latest()->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'age' => 'required|integer',
            'weight' => 'required|numeric',
            'height' => 'required|numeric',
            'bmi_value' => 'required|numeric',
            'status' => 'required|string',
        ]);
        return $request->user()->bmiRecords()->create($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(BmiRecord $bmiRecord)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, BmiRecord $bmiRecord)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(BmiRecord $bmiRecord)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DiscoverItemController extends Controller
{
    public function index()
    {
        $items = \App\Models\DiscoverItem::all();
        $hero = $items->where('is_featured', true)->first();
        $list = $items->where('is_featured', false)->values();
        
        return response()->json([
            'featured' => $hero,
            'items' => $list
        ]);
    }
}

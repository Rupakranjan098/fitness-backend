<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OutdoorLog extends Model
{
    protected $fillable = [
        'user_id', 'type', 'distance_km', 'duration_seconds', 'average_speed', 'path_coordinates', 'log_date'
    ];
    
    protected $casts = [
        'path_coordinates' => 'array'
    ];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NutritionLog extends Model
{
    protected $fillable = [
        'user_id',
        'calories',
        'water_intake',
        'log_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

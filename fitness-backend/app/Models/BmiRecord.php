<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BmiRecord extends Model
{
    protected $fillable = [
        'user_id',
        'age',
        'weight',
        'height',
        'bmi_value',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WellnessLog extends Model
{
    protected $fillable = ['user_id', 'type', 'duration_minutes', 'log_date'];
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkoutLog extends Model
{
    protected $fillable = ['user_id', 'type', 'exercise_name', 'duration_minutes', 'calories_burned', 'log_date'];
}

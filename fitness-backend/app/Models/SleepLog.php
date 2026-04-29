<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SleepLog extends Model
{
    protected $fillable = ['user_id', 'start_time', 'end_time', 'duration_minutes', 'quality', 'log_date'];
}

<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'age',
        'gender',
        'height',
        'weight',
        'phone',
        'bio',
        'profile_picture',
        'goal',
        'dob',
        'nation',
        'fitness_level',
        'training_location',
        'equipment_type',
        'equipment',
        'areas_of_concern',
        'days_per_week',
        'session_duration',
        'include_warmup',
        'include_cooldown',
        'include_cardio',
    ];

    public function bmiRecords()
    {
        return $this->hasMany(BmiRecord::class);
    }

    public function nutritionLogs()
    {
        return $this->hasMany(NutritionLog::class);
    }

    public function sleepLogs()
    {
        return $this->hasMany(SleepLog::class);
    }

    public function workoutLogs()
    {
        return $this->hasMany(WorkoutLog::class);
    }

    public function wellnessLogs()
    {
        return $this->hasMany(WellnessLog::class);
    }

    public function outdoorLogs()
    {
        return $this->hasMany(OutdoorLog::class);
    }

    public function hydrationLogs()
    {
        return $this->hasMany(HydrationLog::class);
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'equipment' => 'array',
            'areas_of_concern' => 'array',
            'days_per_week' => 'integer',
            'session_duration' => 'integer',
            'include_warmup' => 'boolean',
            'include_cooldown' => 'boolean',
            'include_cardio' => 'boolean',
        ];
    }
}

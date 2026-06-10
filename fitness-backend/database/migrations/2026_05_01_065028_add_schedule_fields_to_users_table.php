<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->integer('days_per_week')->nullable();
            $table->integer('session_duration')->nullable();
            $table->boolean('include_warmup')->nullable();
            $table->boolean('include_cooldown')->nullable();
            $table->boolean('include_cardio')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'days_per_week', 
                'session_duration', 
                'include_warmup', 
                'include_cooldown', 
                'include_cardio'
            ]);
        });
    }
};

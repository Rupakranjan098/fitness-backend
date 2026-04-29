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
        Schema::create('discover_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type');
            $table->string('duration');
            $table->string('icon');
            $table->string('color');
            $table->string('route');
            $table->boolean('is_featured')->default(false);
            $table->string('description')->nullable();
            $table->string('level')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('discover_items');
    }
};

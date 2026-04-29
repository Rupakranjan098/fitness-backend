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
            $table->decimal('height', 8, 2)->nullable()->after('gender');
            $table->decimal('weight', 8, 2)->nullable()->after('height');
            $table->string('phone')->nullable()->after('email');
            $table->text('bio')->nullable()->after('gender');
            $table->string('profile_picture')->nullable()->after('name');
            $table->string('goal')->nullable()->after('weight');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['height', 'weight', 'phone', 'bio', 'profile_picture', 'goal']);
        });
    }
};

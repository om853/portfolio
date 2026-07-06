<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('api_keys', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->default('deepseek');
            $table->text('key');
            $table->string('label')->nullable();
            $table->integer('daily_limit')->default(100);
            $table->integer('monthly_limit')->default(3000);
            $table->integer('daily_used')->default(0);
            $table->integer('monthly_used')->default(0);
            $table->timestamp('daily_reset_at')->nullable();
            $table->timestamp('monthly_reset_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('api_keys');
    }
};
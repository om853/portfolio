<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('api_keys', function (Blueprint $table) {
            $table->string('type')->default('rotation')->after('provider');
            $table->timestamp('last_used_at')->nullable()->after('monthly_reset_at');
            $table->text('notes')->nullable()->after('priority');
        });
    }

    public function down(): void
    {
        Schema::table('api_keys', function (Blueprint $table) {
            $table->dropColumn(['type', 'last_used_at', 'notes']);
        });
    }
};

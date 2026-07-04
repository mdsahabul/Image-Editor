<?php
/*
 * Image Editor
 * Copyright © 2026 Md. Sahabul. All rights reserved.
 * Designed & developed by Md. Sahabul.
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('folder_id')->nullable()->constrained('folders')->nullOnDelete();
            $table->string('title', 200);
            $table->unsignedInteger('canvas_width')->default(1920);
            $table->unsignedInteger('canvas_height')->default(1080);
            $table->string('background_color', 20)->default('#ffffff');
            $table->string('thumbnail_path')->nullable();
            $table->boolean('is_template')->default(false);
            $table->timestamp('last_opened_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index('user_id');
            $table->index('folder_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

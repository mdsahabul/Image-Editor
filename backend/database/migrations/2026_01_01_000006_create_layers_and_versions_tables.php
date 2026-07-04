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
        Schema::create('layers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('image_asset_id')->nullable()->constrained('image_assets')->nullOnDelete();
            $table->enum('type', ['image', 'text', 'shape', 'group'])->default('image');
            $table->string('name', 150)->default('Layer');
            $table->integer('z_index')->default(0);
            $table->boolean('is_visible')->default(true);
            $table->boolean('is_locked')->default(false);
            $table->decimal('opacity', 4, 3)->default(1.000);
            $table->json('transform_json');
            $table->json('style_json')->nullable();
            $table->json('fabric_object_json')->nullable();
            $table->timestamps();

            $table->index('project_id');
        });

        Schema::create('project_versions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->json('snapshot_json');
            $table->string('label', 150)->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index('project_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_versions');
        Schema::dropIfExists('layers');
    }
};

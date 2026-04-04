<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Create the projects table to store all portfolio projects
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            // Project basic info
            $table->string('title');
            $table->text('description');

            // Category: frontend / backend / fullstack
            $table->string('category', 100);

            // Tech stack stored as JSON array e.g. ["React", "Laravel"]
            $table->jsonb('tech_stack')->default('[]');

            // Cloudinary image URL — store only the URL, not the file
            $table->string('image_url', 500)->nullable();

            // External links — both optional
            $table->string('github_url', 500)->nullable();
            $table->string('deploy_url', 500)->nullable();

            // Show this project on the homepage hero section
            $table->boolean('is_featured')->default(false);

            $table->timestamps();
        });
    }

    // Drop the table if we rollback
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

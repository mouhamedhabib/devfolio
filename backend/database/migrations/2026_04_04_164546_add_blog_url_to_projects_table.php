<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    // Add blog_url column to existing projects table
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            // Optional blog/article URL — shown when project has no github/deploy links
            $table->string('blog_url', 500)->nullable()->after('deploy_url');
        });
    }

    // Remove blog_url column on rollback
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('blog_url');
        });
    }
};

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Project extends Model
{
    use HasFactory;

    // Fields that are allowed to be mass-assigned (create/update)
    // Without this, Laravel blocks all mass assignment for security
    protected $fillable = [
        'title',
        'description',
        'category',
        'tech_stack',
        'image_url',
        'github_url',
        'deploy_url',
        'blog_url',
        'is_featured',
    ];

    // Tell Laravel how to cast each field to the correct PHP type
    // Without casts, JSON comes back as a plain string
    protected $casts = [
        'tech_stack'  => 'array',    // JSON in DB → PHP array
        'is_featured' => 'boolean',  // 0/1 in DB → true/false
    ];
}

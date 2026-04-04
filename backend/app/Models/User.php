<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // HasApiTokens — enables Sanctum token creation for this model
    // Notifiable  — enables sending notifications (email, etc.)
    use HasApiTokens, HasFactory, Notifiable;

    // Fields allowed for mass assignment
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    // Fields hidden from JSON responses — never expose password or tokens
    protected $hidden = [
        'password',
        'remember_token',
    ];

    // Cast password to hashed automatically on save
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }
}

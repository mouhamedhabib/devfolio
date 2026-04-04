<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProjectController;

// ── Public routes — no authentication required ──────────────────
// Anyone can read projects (the portfolio is public)
Route::get('/projects', [ProjectController::class, 'index']);
Route::get('/projects/{project}', [ProjectController::class, 'show']);

// ── Auth routes — login does not require a token ─────────────────
Route::post('/auth/login', [AuthController::class, 'login']);

// ── Protected routes — Sanctum token required ────────────────────
// All routes inside this group require a valid Bearer token
Route::middleware('auth:sanctum')->group(function () {

    // Logout — revokes the current token
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Admin project management — full CRUD
    Route::prefix('admin')->group(function () {
        Route::post('/projects',             [ProjectController::class, 'store']);
        Route::put('/projects/{project}',    [ProjectController::class, 'update']);
        Route::delete('/projects/{project}', [ProjectController::class, 'destroy']);
    });
});

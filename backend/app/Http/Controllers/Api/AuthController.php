<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // Admin login — returns a Sanctum token on success
    public function login(Request $request): JsonResponse
    {
        // Validate that email and password are present
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        // Check credentials against the users table
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Return 401 if credentials are wrong — never reveal which field is wrong
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();

        // Delete all previous tokens for this user before creating a new one
        // This enforces single-session login for the admin
        $user->tokens()->delete();

        // Create a new Sanctum token named 'admin-token'
        $token = $user->createToken('admin-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user'  => [
                'id'    => $user->id,
                'email' => $user->email,
                'name'  => $user->name,
            ],
        ], 200);
    }

    // Admin logout — revokes the current token
    public function logout(Request $request): JsonResponse
    {
        // Delete only the token used in this request
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ], 200);
    }
}

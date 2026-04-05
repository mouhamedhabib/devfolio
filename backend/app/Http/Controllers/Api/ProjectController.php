<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    public function __construct(private CloudinaryService $cloudinary) {}

    public function index(Request $request): JsonResponse
    {
        $query = Project::query();

        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        $sort = $request->get('sort', 'latest');
        $query->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

        return response()->json(['data' => $query->get()], 200);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json(['data' => $project], 200);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'category'     => 'required|in:frontend,backend,fullstack',
            'tech_stack'   => 'required|array',
            'tech_stack.*' => 'string',
            // Accept either a file upload or a direct URL — not both
            'image'        => 'nullable|image|mimes:jpeg,jpg,png,webp,gif|max:2048',
            'image_url'    => 'nullable|url|max:500',
            'github_url'   => 'nullable|url|max:500',
            'deploy_url'   => 'nullable|url|max:500',
            'blog_url'     => 'nullable|url|max:500',
            'is_featured'  => 'nullable',
        ]);

        $validated['is_featured'] = filter_var(
            $request->input('is_featured', false),
            FILTER_VALIDATE_BOOLEAN
        );

        // File upload takes priority over URL
        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->cloudinary->uploadImage($request->file('image'));
        }
        // If no file but URL provided, use it directly
        elseif ($request->filled('image_url')) {
            $validated['image_url'] = $request->input('image_url');
        }

        unset($validated['image']);

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Project created successfully',
            'data'    => $project,
        ], 201);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'description'  => 'sometimes|string',
            'category'     => 'sometimes|in:frontend,backend,fullstack',
            'tech_stack'   => 'sometimes|array',
            'tech_stack.*' => 'string',
            'image'        => 'nullable|image|mimes:jpeg,jpg,png,webp,gif|max:2048',
            'image_url'    => 'nullable|url|max:500',
            'github_url'   => 'nullable|url|max:500',
            'deploy_url'   => 'nullable|url|max:500',
            'blog_url'     => 'nullable|url|max:500',
            'is_featured'  => 'nullable',
        ]);

        if ($request->has('is_featured')) {
            $validated['is_featured'] = filter_var(
                $request->input('is_featured'),
                FILTER_VALIDATE_BOOLEAN
            );
        }

        if ($request->hasFile('image')) {
            // Delete old Cloudinary image before uploading new one
            $this->cloudinary->deleteImage($project->image_url);
            $validated['image_url'] = $this->cloudinary->uploadImage($request->file('image'));
        } elseif ($request->filled('image_url')) {
            $validated['image_url'] = $request->input('image_url');
        }

        unset($validated['image']);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'data'    => $project,
        ], 200);
    }

    public function destroy(Project $project): JsonResponse
    {
        $this->cloudinary->deleteImage($project->image_url);
        $project->delete();

        return response()->json(['message' => 'Project deleted successfully'], 200);
    }
}

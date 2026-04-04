<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Services\CloudinaryService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ProjectController extends Controller
{
    // Inject CloudinaryService via constructor — this is dependency injection
    // Laravel automatically creates the service instance for us
    public function __construct(private CloudinaryService $cloudinary) {}

    // GET /api/projects — return all projects with optional filters
    public function index(Request $request): JsonResponse
    {
        $query = Project::query();

        // Filter by category if provided — ?category=frontend
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }

        // Filter by featured status — ?featured=true
        if ($request->has('featured')) {
            $query->where('is_featured', filter_var($request->featured, FILTER_VALIDATE_BOOLEAN));
        }

        // Sort results — default latest first
        $sort = $request->get('sort', 'latest');
        $query->orderBy('created_at', $sort === 'oldest' ? 'asc' : 'desc');

        return response()->json(['data' => $query->get()], 200);
    }

    // GET /api/projects/{id} — return a single project
    public function show(Project $project): JsonResponse
    {
        return response()->json(['data' => $project], 200);
    }

    // POST /api/admin/projects — create a new project with optional image
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'category'     => 'required|in:frontend,backend,fullstack',
            'tech_stack'   => 'required|array',
            'tech_stack.*' => 'string',
            // image is optional — max 2MB, only image formats allowed
            'image'        => 'nullable|image|max:2048',
            'github_url'   => 'nullable|url|max:500',
            'deploy_url'   => 'nullable|url|max:500',
            'is_featured'  => 'boolean',
        ]);

        // If an image file was uploaded, send it to Cloudinary
        // Store only the returned URL in the database
        if ($request->hasFile('image')) {
            $validated['image_url'] = $this->cloudinary->uploadImage(
                $request->file('image')
            );
        }

        // Remove 'image' key — it's a file, not a DB column
        unset($validated['image']);

        $project = Project::create($validated);

        return response()->json([
            'message' => 'Project created successfully',
            'data'    => $project,
        ], 201);
    }

    // PUT /api/admin/projects/{id} — update project, replace image if provided
    public function update(Request $request, Project $project): JsonResponse
    {
        $validated = $request->validate([
            'title'        => 'sometimes|string|max:255',
            'description'  => 'sometimes|string',
            'category'     => 'sometimes|in:frontend,backend,fullstack',
            'tech_stack'   => 'sometimes|array',
            'tech_stack.*' => 'string',
            'image'        => 'nullable|image|max:2048',
            'github_url'   => 'nullable|url|max:500',
            'deploy_url'   => 'nullable|url|max:500',
            'is_featured'  => 'boolean',
        ]);

        // If a new image is uploaded, delete the old one and upload the new one
        if ($request->hasFile('image')) {
            // Delete old image from Cloudinary to avoid orphaned files
            if ($project->image_url) {
                $this->cloudinary->deleteImage($project->image_url);
            }

            $validated['image_url'] = $this->cloudinary->uploadImage(
                $request->file('image')
            );
        }

        unset($validated['image']);

        $project->update($validated);

        return response()->json([
            'message' => 'Project updated successfully',
            'data'    => $project,
        ], 200);
    }

    // DELETE /api/admin/projects/{id} — delete project and its image
    public function destroy(Project $project): JsonResponse
    {
        // Delete image from Cloudinary before removing the DB record
        if ($project->image_url) {
            $this->cloudinary->deleteImage($project->image_url);
        }

        $project->delete();

        return response()->json([
            'message' => 'Project deleted successfully',
        ], 200);
    }
}

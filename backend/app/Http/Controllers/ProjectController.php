<?php
/**
 * @module  Project
 * @desc    Modul proyek kolaborasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectRequest;
use App\Models\Project;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class ProjectController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(): JsonResponse
    {
        try {
            $projects = $this->projectService->getAllProjects();
            return response()->json(['status' => 'success', 'data' => $projects]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(StoreProjectRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $project = $this->projectService->createProject($user->id, $request->validated());
            return response()->json(['status' => 'success', 'message' => 'Proyek berhasil dibuat.', 'data' => $project], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $project = $this->projectService->getProjectDetails($id);
            return response()->json(['status' => 'success', 'data' => $project]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 404);
        }
    }
}

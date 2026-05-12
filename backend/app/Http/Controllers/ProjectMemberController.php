<?php
/**
 * @module  Project
 * @desc    Modul proyek kolaborasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Exception;

class ProjectMemberController extends Controller
{
    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function join(int $projectId): JsonResponse
    {
        try {
            $user = auth()->user();
            $member = $this->projectService->joinProject($projectId, $user->id);
            return response()->json(['status' => 'success', 'message' => 'Berhasil mengajukan bergabung.', 'data' => $member], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }

    public function review(Request $request, int $memberId): JsonResponse
    {
        $request->validate(['status' => 'required|in:approved,rejected']);
        
        try {
            $user = auth()->user();
            $member = $this->projectService->reviewMember($user->id, $memberId, $request->status);
            return response()->json(['status' => 'success', 'message' => 'Status anggota diperbarui.', 'data' => $member]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}

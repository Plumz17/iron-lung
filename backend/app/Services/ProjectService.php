<?php
/**
 * @module  Project
 * @desc    Modul proyek kolaborasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Services;

use App\Models\Project;
use App\Models\ProjectMember;

class ProjectService
{
    public function getAllProjects()
    {
        return Project::with('owner:id,email')->withCount('members')->orderBy('created_at', 'desc')->get();
    }

    public function createProject(int $userId, array $data): Project
    {
        $data['user_id'] = $userId;
        $data['status'] = 'open';
        return Project::create($data);
    }

    public function getProjectDetails(int $id)
    {
        return Project::with(['owner:id,email', 'members.user:id,email'])->findOrFail($id);
    }

    public function joinProject(int $projectId, int $userId): ProjectMember
    {
        $project = Project::findOrFail($projectId);
        
        if ($project->status !== 'open') {
            throw new \Exception("Proyek ini sudah tidak menerima anggota.");
        }

        if ($project->user_id === $userId) {
            throw new \Exception("Anda adalah pemilik proyek ini.");
        }

        $existingMember = ProjectMember::where('project_id', $projectId)->where('user_id', $userId)->first();
        if ($existingMember) {
            throw new \Exception("Anda sudah mengajukan diri atau sudah menjadi anggota.");
        }

        return ProjectMember::create([
            'project_id' => $projectId,
            'user_id' => $userId,
            'status' => 'pending'
        ]);
    }

    public function reviewMember(int $ownerId, int $memberId, string $status)
    {
        $member = ProjectMember::with('project')->findOrFail($memberId);

        if ($member->project->user_id !== $ownerId) {
            throw new \Exception("Unauthorized. Anda bukan pemilik proyek ini.");
        }

        $member->update(['status' => $status]);
        return $member;
    }
}

<?php
/**
 * @module  Admin Dashboard
 * @desc    API untuk mengumpulkan statistik dasbor admin
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Opportunity;
use App\Models\Application;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Exception;

class AdminDashboardController extends Controller
{
    /**
     * Dapatkan agregasi data untuk dashboard admin.
     * Menggunakan Redis/File Caching (5 menit) untuk performa NFR < 300ms.
     */
    public function getStatistics(): JsonResponse
    {
        try {
            // Cache kunci spesifik selama 300 detik (5 menit)
            $stats = Cache::remember('admin_dashboard_stats', 300, function () {
                $studentRoleId = Role::where('name', 'Student')->value('id');
                $partnerRoleId = Role::where('name', 'Partner')->value('id');

                return [
                    'users' => [
                        'total_students' => User::where('role_id', $studentRoleId)->count(),
                        'total_partners' => User::where('role_id', $partnerRoleId)->count(),
                    ],
                    'opportunities' => [
                        'pending' => Opportunity::where('status', 'pending')->count(),
                        'approved' => Opportunity::where('status', 'approved')->count(),
                        'rejected' => Opportunity::where('status', 'rejected')->count(),
                        'total' => Opportunity::count(),
                    ],
                    'applications' => [
                        'total' => Application::count(),
                    ],
                    'projects' => [
                        'total' => Project::count(),
                    ]
                ];
            });

            return response()->json([
                'status' => 'success',
                'data' => $stats
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

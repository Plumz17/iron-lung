<?php
/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\ReviewApplicationRequest;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Exception;

class PartnerApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    public function applicantsForOpportunity(int $opportunityId): JsonResponse
    {
        try {
            $user = auth()->user();
            $applicants = $this->applicationService->getApplicantsForOpportunity($user->id, $opportunityId);
            return response()->json(['status' => 'success', 'data' => $applicants]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 403);
        }
    }

    public function review(ReviewApplicationRequest $request, int $applicationId): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = $this->applicationService->reviewApplication($user->id, $applicationId, $request->status);
            return response()->json(['status' => 'success', 'message' => 'Status lamaran diperbarui.', 'data' => $application]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 403);
        }
    }
}

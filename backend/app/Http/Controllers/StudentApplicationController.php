<?php
/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Exception;

class StudentApplicationController extends Controller
{
    protected $applicationService;

    public function __construct(ApplicationService $applicationService)
    {
        $this->applicationService = $applicationService;
    }

    public function availableOpportunities(): JsonResponse
    {
        try {
            $opportunities = $this->applicationService->getAvailableOpportunities();
            return response()->json(['status' => 'success', 'data' => $opportunities]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function myApplications(): JsonResponse
    {
        try {
            $user = auth()->user();
            $applications = $this->applicationService->getStudentApplications($user->id);
            return response()->json(['status' => 'success', 'data' => $applications]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function apply(StoreApplicationRequest $request, int $opportunityId): JsonResponse
    {
        try {
            $user = auth()->user();
            $application = $this->applicationService->applyToOpportunity($user->id, $opportunityId, $request->validated());
            return response()->json(['status' => 'success', 'message' => 'Lamaran berhasil dikirim.', 'data' => $application], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 400);
        }
    }
}

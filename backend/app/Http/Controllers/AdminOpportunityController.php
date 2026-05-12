<?php
/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\ReviewOpportunityRequest;
use App\Models\Opportunity;
use App\Services\OpportunityService;
use Illuminate\Http\JsonResponse;
use Exception;

class AdminOpportunityController extends Controller
{
    protected $opportunityService;

    public function __construct(OpportunityService $opportunityService)
    {
        $this->opportunityService = $opportunityService;
    }

    public function index(): JsonResponse
    {
        try {
            $opportunities = $this->opportunityService->getAllOpportunities();
            
            return response()->json([
                'status' => 'success',
                'data' => $opportunities
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function review(ReviewOpportunityRequest $request, Opportunity $opportunity): JsonResponse
    {
        try {
            $reviewed = $this->opportunityService->reviewOpportunity($opportunity, $request->status);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peluang berhasil ditinjau.',
                'data' => $reviewed
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

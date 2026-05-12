<?php
/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreOpportunityRequest;
use App\Http\Requests\UpdateOpportunityRequest;
use App\Models\Opportunity;
use App\Services\OpportunityService;
use Illuminate\Http\JsonResponse;
use Exception;

class PartnerOpportunityController extends Controller
{
    protected $opportunityService;

    public function __construct(OpportunityService $opportunityService)
    {
        $this->opportunityService = $opportunityService;
    }

    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();
            $opportunities = $this->opportunityService->getPartnerOpportunities($user->id);
            
            return response()->json([
                'status' => 'success',
                'data' => $opportunities
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function store(StoreOpportunityRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $opportunity = $this->opportunityService->createOpportunity($user->id, $request->validated());
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peluang berhasil dibuat dan sedang menunggu persetujuan Admin.',
                'data' => $opportunity
            ], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function show(Opportunity $opportunity): JsonResponse
    {
        // Otorisasi sederhana: Pastikan milik mitra yang login
        if ($opportunity->user_id !== auth()->id()) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $opportunity
        ]);
    }

    public function update(UpdateOpportunityRequest $request, Opportunity $opportunity): JsonResponse
    {
        if ($opportunity->user_id !== auth()->id()) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        try {
            $updated = $this->opportunityService->updateOpportunity($opportunity, $request->validated());
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peluang berhasil diperbarui dan status dikembalikan ke pending.',
                'data' => $updated
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(Opportunity $opportunity): JsonResponse
    {
        if ($opportunity->user_id !== auth()->id()) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        try {
            $this->opportunityService->deleteOpportunity($opportunity);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Peluang berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

<?php
/**
 * @module  Recommendation
 * @desc    Controller untuk rekomendasi
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;
use Exception;

class RecommendationController extends Controller
{
    protected $recommendationService;

    public function __construct(RecommendationService $recommendationService)
    {
        $this->recommendationService = $recommendationService;
    }

    public function index(): JsonResponse
    {
        try {
            $user = auth()->user();
            $recommendations = $this->recommendationService->getRecommendations($user->id);
            return response()->json([
                'status' => 'success',
                'data' => $recommendations
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

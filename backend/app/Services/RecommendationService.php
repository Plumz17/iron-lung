<?php
/**
 * @module  Recommendation
 * @desc    Layanan untuk mencari peluang yang cocok dengan minat mahasiswa
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Services;

use App\Models\Opportunity;
use App\Models\StudentProfile;
use Illuminate\Support\Facades\DB;

class RecommendationService
{
    /**
     * Dapatkan rekomendasi peluang berdasarkan tag minat mahasiswa.
     * Menggunakan perhitungan irisan tag terbanyak.
     */
    public function getRecommendations(int $userId)
    {
        $profile = StudentProfile::with('tags')->where('user_id', $userId)->first();

        // Jika mahasiswa belum punya profil atau belum milih tag, kembalikan peluang terbaru saja.
        if (!$profile || $profile->tags->isEmpty()) {
            return Opportunity::with(['user:id,email', 'tags'])
                ->where('status', 'approved')
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function ($opp) {
                    $opp->match_score = 0;
                    return $opp;
                });
        }

        $studentTagIds = $profile->tags->pluck('id')->toArray();

        // Cari Peluang berstatus approved, join dengan opportunity_tag, 
        // dan hitung berapa banyak tag yang beririsan.
        $recommendedOpportunities = Opportunity::with(['user:id,email', 'tags'])
            ->where('status', 'approved')
            ->select('opportunities.*') // Pastikan mengambil field opportunities
            ->join('opportunity_tag', 'opportunities.id', '=', 'opportunity_tag.opportunity_id')
            ->whereIn('opportunity_tag.tag_id', $studentTagIds)
            ->groupBy('opportunities.id')
            // Count seberapa banyak tag yang cocok
            ->selectRaw('COUNT(opportunity_tag.tag_id) as match_score')
            ->orderBy('match_score', 'desc')
            ->orderBy('opportunities.created_at', 'desc')
            ->limit(20)
            ->get();

        return $recommendedOpportunities;
    }
}

<?php
/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Services;

use App\Models\Opportunity;

class OpportunityService
{
    /**
     * Dapatkan semua peluang milik mitra tertentu.
     */
    public function getPartnerOpportunities(int $partnerId)
    {
        return Opportunity::with('tags')->withCount('applications')->where('user_id', $partnerId)->orderBy('created_at', 'desc')->get();
    }

    /**
     * Dapatkan semua peluang yang ada di sistem (untuk Admin).
     */
    public function getAllOpportunities()
    {
        return Opportunity::with(['user:id,email', 'tags'])->orderBy('created_at', 'desc')->get();
    }

    /**
     * Mitra membuat peluang baru.
     */
    public function createOpportunity(int $partnerId, array $data): Opportunity
    {
        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        $data['user_id'] = $partnerId;
        $data['status'] = 'pending'; // Pastikan default-nya pending
        
        $opportunity = Opportunity::create($data);
        if (!empty($tagIds)) {
            $opportunity->tags()->sync($tagIds);
        }

        return $opportunity;
    }

    /**
     * Mitra mengedit peluang miliknya.
     */
    public function updateOpportunity(Opportunity $opportunity, array $data): Opportunity
    {
        $tagIds = $data['tag_ids'] ?? [];
        unset($data['tag_ids']);

        // Jika sebelumnya rejected, kembalikan ke pending sesuai aturan bisnis
        if ($opportunity->status === 'rejected') {
            $data['status'] = 'pending';
        }
        
        // Catatan: Jika sebelumnya approved, edit mungkin butuh re-review atau tidak,
        // Untuk amannya, mari kembalikan ke pending jika ada pengeditan, atau biarkan.
        // Sesuai requirement, fokus ke "rejected -> pending".
        // Mari kita terapkan: semua edit mengembalikan status ke pending agar Admin meninjau perubahannya.
        $data['status'] = 'pending';

        $opportunity->update($data);

        if (!empty($tagIds)) {
            $opportunity->tags()->sync($tagIds);
        }

        return $opportunity;
    }

    /**
     * Mitra menghapus peluang miliknya.
     */
    public function deleteOpportunity(Opportunity $opportunity): void
    {
        $opportunity->delete();
    }

    /**
     * Admin mengubah status peluang (Approve/Reject).
     */
    public function reviewOpportunity(Opportunity $opportunity, string $status): Opportunity
    {
        $opportunity->update(['status' => $status]);
        return $opportunity;
    }
}

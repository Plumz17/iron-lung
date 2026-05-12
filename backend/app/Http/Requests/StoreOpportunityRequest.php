<?php
/**
 * @module  Opportunity
 * @desc    Modul pengelolaan peluang magang/lomba (Mitra & Admin)
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:internship,competition,training',
            'location' => 'nullable|string|max:255',
            'deadline' => 'nullable|date|after_or_equal:today',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ];
    }
}

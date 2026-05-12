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

class ReviewOpportunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Dibatasi oleh Middleware Role:Admin di rute
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:approved,rejected',
        ];
    }
}

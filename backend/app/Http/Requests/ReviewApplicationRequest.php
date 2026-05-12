<?php
/**
 * @module  Application
 * @desc    Modul lamaran mahasiswa ke peluang mitra
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Dibatasi middleware Role:Partner di rute
    }

    public function rules(): array
    {
        return [
            'status' => 'required|in:under_review,accepted,rejected',
        ];
    }
}

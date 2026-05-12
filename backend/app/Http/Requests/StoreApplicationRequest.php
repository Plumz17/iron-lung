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

class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Dibatasi middleware Role:Student di rute
    }

    public function rules(): array
    {
        return [
            'cover_letter' => 'required|string|min:50|max:5000',
        ];
    }
    
    public function messages(): array
    {
        return [
            'cover_letter.required' => 'Surat lamaran (cover letter) wajib diisi.',
            'cover_letter.min' => 'Surat lamaran harus setidaknya berisi 50 karakter.',
        ];
    }
}

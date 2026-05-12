<?php
/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadCvRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'cv_file' => 'required|file|mimes:pdf|max:5120', // Maksimal 5MB, hanya PDF
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cv_file.required' => 'File CV wajib diunggah.',
            'cv_file.mimes' => 'File CV harus berformat PDF.',
            'cv_file.max' => 'Ukuran file CV maksimal adalah 5MB.',
        ];
    }
}

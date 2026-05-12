<?php
/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SyncStudentTagsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'tag_ids' => 'required|array|min:3',
            'tag_ids.*' => 'integer|exists:tags,id',
        ];
    }

    public function messages(): array
    {
        return [
            'tag_ids.min' => 'Anda harus memilih minimal 3 tag minat.',
            'tag_ids.required' => 'Pilihan tag wajib diisi.',
            'tag_ids.*.exists' => 'Salah satu tag yang dipilih tidak valid.'
        ];
    }
}

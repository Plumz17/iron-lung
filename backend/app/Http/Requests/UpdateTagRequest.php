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
use Illuminate\Validation\Rule;

class UpdateTagRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $tagId = $this->route('tag');
        return [
            'name' => [
                'required',
                'string',
                'max:50',
                Rule::unique('tags')->ignore($tagId),
            ],
        ];
    }
}

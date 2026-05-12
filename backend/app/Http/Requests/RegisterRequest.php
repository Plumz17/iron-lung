<?php
/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true; // Siapapun bisa registrasi
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'role_id' => 'required|exists:roles,id',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8', // Harus 8 karakter minimal sesuai rule
            // field profile lainnya akan diurus di modul profile nanti
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.unique' => 'Email sudah terdaftar. Gunakan email lain atau login.',
            'password.min' => 'Password minimal 8 karakter.',
        ];
    }
}

<?php
/**
 * @module  Auth
 * @desc    Modul autentikasi dan otorisasi pengguna (JWT + RBAC)
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * Memastikan user memiliki role yang sesuai.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  ...$roles
     * @return mixed
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = auth()->user();

        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
        }

        // Cek apakah nama role user ada dalam array roles yang diizinkan
        if (!in_array($user->role->name, $roles)) {
            return response()->json(['status' => 'error', 'message' => 'Forbidden. Akses ditolak untuk role Anda.'], 403);
        }

        return $next($request);
    }
}

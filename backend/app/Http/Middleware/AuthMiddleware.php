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
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Exception;

class AuthMiddleware
{
    /**
     * Handle an incoming request.
     * Memverifikasi keberadaan dan keabsahan JWT Token.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            if (!$user) {
                return response()->json(['status' => 'error', 'message' => 'User not found'], 401);
            }
        } catch (Exception $e) {
            if ($e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException){
                return response()->json(['status' => 'error', 'message' => 'Token is Invalid'], 401);
            } else if ($e instanceof \PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException){
                return response()->json(['status' => 'error', 'message' => 'Token is Expired'], 401);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Authorization Token not found'], 401);
            }
        }

        return $next($request);
    }
}

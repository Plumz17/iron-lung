<?php
/**
 * @module  Recommendation
 * @desc    Controller untuk membaca Tag publik
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Exception;

class PublicTagController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            // Semua pengguna login bisa melihat daftar tag yang ada
            $tags = Tag::orderBy('name')->get();
            return response()->json([
                'status' => 'success',
                'data' => $tags
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

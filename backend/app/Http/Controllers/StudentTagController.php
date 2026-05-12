<?php
/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\SyncStudentTagsRequest;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;
use Exception;

class StudentTagController extends Controller
{
    protected $tagService;

    public function __construct(TagService $tagService)
    {
        $this->tagService = $tagService;
    }

    public function index(): JsonResponse
    {
        try {
            $tags = $this->tagService->getAllTags();
            return response()->json([
                'status' => 'success',
                'data' => $tags
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function sync(SyncStudentTagsRequest $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $tagIds = $request->validated()['tag_ids'];

            $syncedTags = $this->tagService->syncStudentTags($user->id, $tagIds);

            return response()->json([
                'status' => 'success',
                'message' => 'Preferensi minat berhasil diperbarui.',
                'data' => $syncedTags
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan saat menyinkronkan minat.',
                'errors' => $e->getMessage()
            ], 500);
        }
    }
}

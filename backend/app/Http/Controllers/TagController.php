<?php
/**
 * @module  Interest Tag
 * @desc    Modul pengelolaan Interest Tag untuk mahasiswa
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Services\TagService;
use Illuminate\Http\JsonResponse;
use Exception;

class TagController extends Controller
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

    public function store(StoreTagRequest $request): JsonResponse
    {
        try {
            $tag = $this->tagService->createTag($request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Tag berhasil dibuat.',
                'data' => $tag
            ], 201);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(UpdateTagRequest $request, int $id): JsonResponse
    {
        try {
            $tag = $this->tagService->updateTag($id, $request->validated());
            return response()->json([
                'status' => 'success',
                'message' => 'Tag berhasil diperbarui.',
                'data' => $tag
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->tagService->deleteTag($id);
            return response()->json([
                'status' => 'success',
                'message' => 'Tag berhasil dihapus.'
            ]);
        } catch (Exception $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }
}

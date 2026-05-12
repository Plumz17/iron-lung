<?php
/**
 * @module  Notification
 * @desc    Controller untuk manajemen notifikasi pengguna
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();
        return response()->json([
            'status' => 'success',
            'data' => $user->notifications()->take(50)->get()
        ]);
    }

    public function markAsRead(string $id): JsonResponse
    {
        $user = auth()->user();
        $notification = $user->notifications()->where('id', $id)->first();

        if ($notification) {
            $notification->markAsRead();
            return response()->json(['status' => 'success', 'message' => 'Notifikasi telah ditandai dibaca.']);
        }

        return response()->json(['status' => 'error', 'message' => 'Notifikasi tidak ditemukan.'], 404);
    }

    public function markAllAsRead(): JsonResponse
    {
        $user = auth()->user();
        $user->unreadNotifications->markAsRead();

        return response()->json(['status' => 'success', 'message' => 'Semua notifikasi telah ditandai dibaca.']);
    }
}

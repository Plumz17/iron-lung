<?php
/**
 * @module  Notification
 * @desc    Notifikasi untuk mahasiswa saat status lamaran diubah
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationStatusUpdated extends Notification
{
    use Queueable;

    protected $opportunityTitle;
    protected $status;

    public function __construct(string $opportunityTitle, string $status)
    {
        $this->opportunityTitle = $opportunityTitle;
        $this->status = $status;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        $statusLabels = [
            'under_review' => 'Sedang Ditinjau',
            'accepted' => 'Diterima',
            'rejected' => 'Ditolak'
        ];

        $statusLabel = $statusLabels[$this->status] ?? $this->status;

        return [
            'type' => 'application_status',
            'title' => 'Pembaruan Status Lamaran',
            'message' => "Status lamaran Anda untuk {$this->opportunityTitle} telah diubah menjadi: {$statusLabel}.",
            'link' => '/dashboard/student/applications'
        ];
    }
}

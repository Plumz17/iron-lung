<?php
/**
 * @module  Notification
 * @desc    Notifikasi untuk mitra saat ada pelamar baru
 * @author  Anders Tan
 * @date    2026-05-11
 * @version 1.0
 */

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewApplicantNotification extends Notification
{
    use Queueable;

    protected $opportunityTitle;
    protected $applicantEmail;

    public function __construct(string $opportunityTitle, string $applicantEmail)
    {
        $this->opportunityTitle = $opportunityTitle;
        $this->applicantEmail = $applicantEmail;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toDatabase($notifiable): array
    {
        return [
            'type' => 'new_applicant',
            'title' => 'Pelamar Baru',
            'message' => "Ada pelamar baru ({$this->applicantEmail}) untuk peluang: {$this->opportunityTitle}.",
            'link' => '/dashboard/partner/opportunities' // Placeholder URL for frontend navigation
        ];
    }
}

<?php
/**
 * @module  Student Profile
 * @desc    Modul pengelolaan profil mahasiswa dan portofolio
 * @author  Anders Tan
 * @date    2026-05-06
 * @version 1.0
 */

namespace App\Services;

use App\Models\Portfolio;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Exception;

class PortfolioService
{
    /**
     * Dapatkan semua portofolio milik user.
     *
     * @param int $userId
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserPortfolios(int $userId)
    {
        return Portfolio::where('user_id', $userId)->get();
    }

    /**
     * Dapatkan detail portofolio.
     *
     * @param int $userId
     * @param int $portfolioId
     * @return Portfolio
     */
    public function getPortfolioById(int $userId, int $portfolioId): Portfolio
    {
        return Portfolio::where('user_id', $userId)->findOrFail($portfolioId);
    }

    /**
     * Buat portofolio baru beserta upload gambar jika ada.
     *
     * @param int $userId
     * @param array $data
     * @param UploadedFile|null $imageFile
     * @return Portfolio
     * @throws Exception
     */
    public function createPortfolio(int $userId, array $data, ?UploadedFile $imageFile): Portfolio
    {
        $imageUrl = null;

        if ($imageFile) {
            $path = $imageFile->store('portfolio_images', config('filesystems.default', 'public'));
            if (!$path) throw new Exception("Gagal mengunggah gambar portofolio.");
            $imageUrl = Storage::disk(config('filesystems.default', 'public'))->url($path);
        }

        return Portfolio::create([
            'user_id' => $userId,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'project_url' => $data['project_url'] ?? null,
            'image_url' => $imageUrl,
        ]);
    }

    /**
     * Update portofolio beserta gambar baru jika ada.
     *
     * @param int $userId
     * @param int $portfolioId
     * @param array $data
     * @param UploadedFile|null $imageFile
     * @return Portfolio
     * @throws Exception
     */
    public function updatePortfolio(int $userId, int $portfolioId, array $data, ?UploadedFile $imageFile): Portfolio
    {
        $portfolio = $this->getPortfolioById($userId, $portfolioId);

        if ($imageFile) {
            // Hapus gambar lama
            if ($portfolio->image_url) {
                $oldPath = str_replace(Storage::url(''), '', $portfolio->image_url);
                Storage::disk(config('filesystems.default'))->delete($oldPath);
            }

            // Simpan gambar baru
            $path = $imageFile->store('portfolio_images', config('filesystems.default', 'public'));
            if (!$path) throw new Exception("Gagal mengunggah gambar portofolio.");
            $data['image_url'] = Storage::disk(config('filesystems.default', 'public'))->url($path);
        }

        $portfolio->update($data);
        return $portfolio;
    }

    /**
     * Hapus portofolio dan gambarnya.
     *
     * @param int $userId
     * @param int $portfolioId
     * @return void
     */
    public function deletePortfolio(int $userId, int $portfolioId): void
    {
        $portfolio = $this->getPortfolioById($userId, $portfolioId);

        if ($portfolio->image_url) {
            $path = str_replace(Storage::url(''), '', $portfolio->image_url);
            Storage::disk(config('filesystems.default'))->delete($path);
        }

        $portfolio->delete();
    }
}

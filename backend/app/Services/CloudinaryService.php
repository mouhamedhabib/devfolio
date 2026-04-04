<?php

namespace App\Services;

use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    // Upload an image to Cloudinary and return its secure URL
    // We store only this URL in the database — not the file itself
    public function uploadImage(UploadedFile $file, string $folder = 'devfolio'): string
    {
        // Upload the file to Cloudinary under the given folder
        $result = Cloudinary::upload($file->getRealPath(), [
            'folder'       => $folder,
            // Auto-detect the best image format (webp, avif, etc.)
            'fetch_format' => 'auto',
            // Auto-adjust quality without visible loss
            'quality'      => 'auto',
        ]);

        // Return only the secure HTTPS URL — this is what we save in DB
        return $result->getSecurePath();
    }

    // Delete an image from Cloudinary using its stored URL
    public function deleteImage(string $imageUrl): void
    {
        $publicId = $this->extractPublicId($imageUrl);

        if ($publicId) {
            Cloudinary::destroy($publicId);
        }
    }

    // Extract Cloudinary public ID from a full URL
    // Example: https://res.cloudinary.com/cloud/image/upload/v123/devfolio/abc.jpg
    // Returns: devfolio/abc
    private function extractPublicId(string $url): ?string
    {
        $path = parse_url($url, PHP_URL_PATH);

        if (!$path) {
            return null;
        }

        // Remove /image/upload/vXXXXXX/ prefix and file extension
        preg_match('/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i', $path, $matches);

        return $matches[1] ?? null;
    }
}

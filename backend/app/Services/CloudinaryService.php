<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CloudinaryService
{
    protected string $cloudName;
    protected string $apiKey;
    protected string $apiSecret;
    protected bool $isConfigured;

    public function __construct()
    {
        $url = (string) config('services.cloudinary.url', '');

        if (!empty($url) && str_starts_with($url, 'cloudinary://')) {
            $parsed = parse_url($url);
            $this->apiKey = $parsed['user'] ?? '';
            $this->apiSecret = $parsed['pass'] ?? '';
            $this->cloudName = $parsed['host'] ?? '';
        } else {
            $this->cloudName = (string) config('services.cloudinary.cloud_name', '');
            $this->apiKey = (string) config('services.cloudinary.api_key', '');
            $this->apiSecret = (string) config('services.cloudinary.api_secret', '');
        }

        $this->isConfigured = !empty($this->cloudName) && !empty($this->apiKey) && !empty($this->apiSecret);
    }

    /**
     * Check if Cloudinary credentials are configured.
     */
    public function isConfigured(): bool
    {
        return $this->isConfigured;
    }

    /**
     * Verify that the Cloudinary credentials are valid by pinging the API.
     *
     * @return array{valid: bool, message: string}
     */
    public function verifyCredentials(): array
    {
        if (!$this->isConfigured) {
            return [
                'valid' => false,
                'message' => 'Cloudinary credentials are not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.',
            ];
        }

        try {
            // Use the Admin API "ping" endpoint to verify credentials
            $response = Http::withBasicAuth($this->apiKey, $this->apiSecret)
                ->withoutVerifying()
                ->timeout(10)
                ->get("https://api.cloudinary.com/v1_1/{$this->cloudName}/ping");

            if ($response->successful()) {
                return [
                    'valid' => true,
                    'message' => 'Cloudinary credentials are valid.',
                ];
            }

            $errorMessage = $response->json('error.message') ?? $response->body();

            return [
                'valid' => false,
                'message' => "Cloudinary credential verification failed: {$errorMessage}",
            ];
        } catch (\Exception $e) {
            Log::error('Cloudinary credential verification failed: ' . $e->getMessage());

            return [
                'valid' => false,
                'message' => 'Unable to verify Cloudinary credentials: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Upload an image to Cloudinary.
     *
     * @param UploadedFile $file
     * @param string $folder
     * @return string The secure URL of the uploaded image.
     *
     * @throws \RuntimeException When credentials are missing or upload fails.
     */
    public function upload(UploadedFile $file, string $folder = 'kandy_travel'): string
    {
        if (!$this->isConfigured) {
            throw new \RuntimeException(
                'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file.'
            );
        }

        // Validate the file is readable before attempting upload
        $realPath = $file->getRealPath();
        if ($realPath === false || !is_readable($realPath)) {
            throw new \RuntimeException('The uploaded file could not be read from disk.');
        }

        $timestamp = time();

        // Parameters to sign (alphabetical order, excluding file & api_key)
        $params = [
            'folder' => $folder,
            'timestamp' => $timestamp,
        ];

        $signature = $this->generateSignature($params);

        try {
            $response = Http::timeout(60)
                ->withoutVerifying()
                ->attach('file', fopen($realPath, 'r'), $file->getClientOriginalName())
                ->post("https://api.cloudinary.com/v1_1/{$this->cloudName}/image/upload", [
                    'api_key' => $this->apiKey,
                    'timestamp' => $timestamp,
                    'signature' => $signature,
                    'folder' => $folder,
                ]);

            if ($response->successful()) {
                $secureUrl = $response->json('secure_url');

                if (empty($secureUrl)) {
                    Log::error('Cloudinary returned success but no secure_url.', [
                        'response' => $response->json(),
                    ]);
                    throw new \RuntimeException('Cloudinary returned an unexpected response without an image URL.');
                }

                Log::info('Image uploaded to Cloudinary.', [
                    'public_id' => $response->json('public_id'),
                    'url' => $secureUrl,
                    'bytes' => $response->json('bytes'),
                    'format' => $response->json('format'),
                ]);

                return $secureUrl;
            }

            // Parse Cloudinary error response
            $errorMessage = $response->json('error.message') ?? 'Unknown error';
            $statusCode = $response->status();

            Log::error('Cloudinary upload failed.', [
                'status' => $statusCode,
                'error' => $errorMessage,
                'cloud_name' => $this->cloudName,
            ]);

            // Provide user-friendly error messages based on HTTP status
            $userMessage = match (true) {
                $statusCode === 401 => 'Cloudinary authentication failed. Please verify your API key and secret in the .env file.',
                $statusCode === 403 => 'Cloudinary access denied. Your API credentials may lack upload permissions.',
                $statusCode === 404 => "Cloudinary cloud name '{$this->cloudName}' was not found. Please check your CLOUDINARY_CLOUD_NAME.",
                $statusCode === 420 => 'Cloudinary rate limit exceeded. Please try again in a moment.',
                $statusCode >= 500 => 'Cloudinary service is temporarily unavailable. Please try again later.',
                default => "Image upload failed: {$errorMessage}",
            };

            throw new \RuntimeException($userMessage);
        } catch (\RuntimeException $e) {
            // Re-throw our own RuntimeExceptions as-is
            throw $e;
        } catch (\Illuminate\Http\Client\ConnectionException $e) {
            Log::error('Cloudinary connection failed: ' . $e->getMessage());
            throw new \RuntimeException('Could not connect to Cloudinary. Please check your network connection and try again.');
        } catch (\Exception $e) {
            Log::error('Cloudinary upload exception: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
            ]);
            throw new \RuntimeException('An unexpected error occurred during image upload: ' . $e->getMessage());
        }
    }

    /**
     * Generate a Cloudinary API signature.
     *
     * @see https://cloudinary.com/documentation/upload_images#generating_authentication_signatures
     */
    protected function generateSignature(array $params): string
    {
        ksort($params);

        $parts = [];
        foreach ($params as $key => $value) {
            $parts[] = "{$key}={$value}";
        }

        return sha1(implode('&', $parts) . $this->apiSecret);
    }
}

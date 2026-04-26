<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\V1\ProductCollection;
use App\Http\Resources\V1\ProductResource;
use App\Models\Product;
use App\Services\CloudinaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function __construct(
        protected CloudinaryService $cloudinary
    ) {}

    public function index(Request $request)
    {
        $perPage = max(1, min($request->integer('per_page', 20), 100));
        $query = Product::query()->with('location')->latest();

        if ($request->filled('q')) {
            $query->search((string) $request->string('q'));
        }

        if ($request->filled('category')) {
            $query->byCategory((string) $request->string('category'));
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', filter_var($request->input('is_active'), FILTER_VALIDATE_BOOL));
        }

        return new ProductCollection($query->paginate($perPage)->withQueryString());
    }

    public function store(StoreProductRequest $request)
    {
        $data = $request->validated();

        // Remove the raw 'image' file from validated data — it is not a model attribute.
        unset($data['image']);

        // Handle image file upload via Cloudinary
        if ($request->hasFile('image')) {
            $imageUrl = $this->uploadImageOrFail($request);
            $data['image_url'] = $imageUrl;
        }

        $product = Product::create($data);

        return (new ProductResource($product->loadMissing('location')))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Product $product)
    {
        return new ProductResource($product->loadMissing('location'));
    }

    public function update(UpdateProductRequest $request, Product $product)
    {
        $data = $request->validated();

        // Remove the raw 'image' file from validated data — it is not a model attribute.
        unset($data['image']);

        // Handle image file upload via Cloudinary
        if ($request->hasFile('image')) {
            $imageUrl = $this->uploadImageOrFail($request);
            $data['image_url'] = $imageUrl;
        }

        $product->update($data);

        return new ProductResource($product->loadMissing('location'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }

    /**
     * Upload the image from the request to Cloudinary, or return a 422 error.
     *
     * @throws \Illuminate\Http\Exceptions\HttpResponseException
     */
    private function uploadImageOrFail(Request $request): string
    {
        // Pre-flight: check if Cloudinary is configured
        if (!$this->cloudinary->isConfigured()) {
            abort(response()->json([
                'message' => 'Image upload is not available.',
                'errors' => [
                    'image' => ['Cloudinary is not configured on the server. Please contact the administrator to set up CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.'],
                ],
            ], 422));
        }

        try {
            return $this->cloudinary->upload($request->file('image'));
        } catch (\RuntimeException $e) {
            abort(response()->json([
                'message' => 'Image upload failed.',
                'errors' => [
                    'image' => [$e->getMessage()],
                ],
            ], 422));
        }
    }
}

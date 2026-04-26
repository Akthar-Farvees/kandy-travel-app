<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ProductCollection;
use App\Http\Resources\V1\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $perPage = max(1, min($request->integer('per_page', 12), 50));
        $query = Product::query()->with('location')->active();

        if ($request->filled('q')) {
            $query->search((string) $request->string('q'));
        }

        if ($request->filled('category')) {
            $query->byCategory((string) $request->string('category'));
        }

        $query->byPriceRange(
            $request->filled('min_price') ? (float) $request->input('min_price') : null,
            $request->filled('max_price') ? (float) $request->input('max_price') : null,
        );

        $sort = $request->string('sort', 'newest')->toString();
        match ($sort) {
            'price_asc' => $query->orderBy('price', 'asc'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'name' => $query->orderBy('name', 'asc'),
            default => $query->orderBy('created_at', 'desc'),
        };

        $products = $query->paginate($perPage)->withQueryString();

        return new ProductCollection($products);
    }

    public function show(Product $product)
    {
        if (! $product->is_active) {
            abort(404, 'Product not found.');
        }

        return new ProductResource($product->loadMissing('location'));
    }

    public function categories(): JsonResponse
    {
        $categories = Product::query()
            ->active()
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category')
            ->values();

        return response()->json(['data' => $categories]);
    }
}

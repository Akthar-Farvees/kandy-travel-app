<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Requests\StoreProductRequest;
use App\Http\Resources\V1\ProductCollection;
use App\Http\Resources\V1\ProductResource;
use Illuminate\Http\Request;
use App\Models\Product;

class ProductController extends Controller
{
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
        $product = Product::create($request->validated());

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
        $product->update($request->validated());

        return new ProductResource($product->loadMissing('location'));
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
}

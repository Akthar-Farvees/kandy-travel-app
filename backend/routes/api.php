<?php

use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\LocationController;
use App\Http\Controllers\Api\V1\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\V1\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::get('location', [LocationController::class, 'show']);
    Route::get('products/categories', [ProductController::class, 'categories']);
    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/{product}', [ProductController::class, 'show']);

    Route::post('auth/login', [AuthController::class, 'login']);

    Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/logout', [AuthController::class, 'logout']);

        Route::prefix('admin')->group(function () {
            Route::apiResource('products', AdminProductController::class);
        });
    });
});

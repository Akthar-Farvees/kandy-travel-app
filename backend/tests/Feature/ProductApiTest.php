<?php

namespace Tests\Feature;

use App\Models\Location;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_products_endpoint_returns_paginated_active_products(): void
    {
        $location = $this->createKandyLocation();

        Product::factory()->for($location)->count(2)->create([
            'is_active' => true,
        ]);
        Product::factory()->for($location)->create([
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/products');

        $response
            ->assertOk()
            ->assertJsonCount(2, 'data')
            ->assertJsonPath('meta.total', 2)
            ->assertJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'category',
                        'price',
                        'formatted_price',
                        'location' => ['id', 'name', 'slug'],
                    ],
                ],
                'meta' => ['current_page', 'per_page', 'total', 'last_page', 'from', 'to'],
                'links' => ['first', 'last', 'prev', 'next'],
            ]);
    }

    public function test_public_products_endpoint_can_filter_by_category(): void
    {
        $location = $this->createKandyLocation();

        Product::factory()->for($location)->create([
            'name' => 'Kandyan Tea Box',
            'category' => 'tea',
        ]);
        Product::factory()->for($location)->create([
            'name' => 'Clay Pot',
            'category' => 'pottery',
        ]);

        $response = $this->getJson('/api/v1/products?category=tea');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.category', 'tea');
    }

    public function test_public_products_endpoint_can_search_by_text_and_tags(): void
    {
        $location = $this->createKandyLocation();

        Product::factory()->for($location)->create([
            'name' => 'Traditional Pottery Bowl',
            'tags' => ['kitchen', 'artisan'],
        ]);
        Product::factory()->for($location)->create([
            'name' => 'Tea Gift Set',
            'tags' => ['beverage'],
        ]);

        $response = $this->getJson('/api/v1/products?q=artisan');

        $response
            ->assertOk()
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Traditional Pottery Bowl');
    }

    public function test_admin_product_creation_requires_authentication(): void
    {
        $location = $this->createKandyLocation();

        $response = $this->postJson('/api/v1/admin/products', [
            'location_id' => $location->id,
            'name' => 'Travel Tea Pack',
            'category' => 'tea',
            'price' => 19.99,
            'short_description' => 'A compact tea set for visitors.',
        ]);

        $response
            ->assertStatus(401)
            ->assertJsonPath('error_code', 'AUTHENTICATION_REQUIRED');
    }

    public function test_admin_product_creation_validates_the_payload(): void
    {
        Sanctum::actingAs(User::factory()->admin()->create());

        $response = $this->postJson('/api/v1/admin/products', []);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors(['location_id', 'name', 'category', 'price', 'short_description']);
    }

    public function test_admin_can_create_update_and_delete_products(): void
    {
        $admin = User::factory()->admin()->create();
        $location = $this->createKandyLocation();

        Sanctum::actingAs($admin);

        $createResponse = $this->postJson('/api/v1/admin/products', [
            'location_id' => $location->id,
            'name' => 'Batik Weekend Scarf',
            'category' => 'textile',
            'price' => 49.5,
            'short_description' => 'Hand-dyed scarf from Kandy artisans.',
            'tags' => ['batik', 'fashion'],
            'is_active' => true,
        ]);

        $createResponse
            ->assertCreated()
            ->assertJsonPath('data.name', 'Batik Weekend Scarf');

        $productId = $createResponse->json('data.id');

        $this->putJson("/api/v1/admin/products/{$productId}", [
            'price' => 59.5,
            'is_active' => false,
        ])->assertOk()
            ->assertJsonPath('data.price', 59.5)
            ->assertJsonPath('data.is_active', false);

        $this->deleteJson("/api/v1/admin/products/{$productId}")
            ->assertNoContent();

        $this->assertDatabaseMissing('products', ['id' => $productId]);
    }

    public function test_non_admin_users_cannot_access_admin_routes(): void
    {
        $location = $this->createKandyLocation();
        Sanctum::actingAs(User::factory()->create());

        $response = $this->postJson('/api/v1/admin/products', [
            'location_id' => $location->id,
            'name' => 'Forbidden Product',
            'category' => 'tea',
            'price' => 10,
            'short_description' => 'Should not be created.',
        ]);

        $response
            ->assertStatus(403)
            ->assertJsonPath('error_code', 'FORBIDDEN');
    }

    private function createKandyLocation(): Location
    {
        return Location::factory()->create([
            'name' => 'Kandy',
            'slug' => 'kandy',
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Models\Location;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'location_id' => Location::factory(),
            'name' => fake()->sentence(3),
            'short_description' => fake()->sentence(12),
            'category' => fake()->randomElement(Product::CATEGORIES),
            'price' => fake()->randomFloat(2, 10, 250),
            'image_url' => fake()->imageUrl(800, 600, 'travel', true),
            'tags' => fake()->words(3),
            'is_active' => true,
        ];
    }
}

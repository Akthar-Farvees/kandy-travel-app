<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $kandy = Location::query()->where('slug', 'kandy')->first();

        if (! $kandy) {
            return;
        }

        $products = [
            [
                'name' => 'Premium Ceylon Tea Gift Box',
                'short_description' => 'A curated selection of the finest loose-leaf teas from Kandy\'s highest estates.',
                'category' => 'tea',
                'price' => 24.99,
                'image_url' => 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=800&q=80',
                'tags' => ['beverage', 'gift', 'organic', 'black tea'],
            ],
            [
                'name' => 'Handcrafted Wooden Elephant',
                'short_description' => 'Intricately carved mahogany elephant, representing Kandy\'s rich cultural heritage.',
                'category' => 'handicraft',
                'price' => 45.00,
                'image_url' => 'https://images.unsplash.com/photo-1590499092496-e260935579fa?w=800&q=80',
                'tags' => ['wood', 'souvenir', 'artisan'],
            ],
            [
                'name' => 'Traditional Batik Silk Scarf',
                'short_description' => 'Vibrant, hand-dyed silk scarf featuring traditional Kandyan floral motifs.',
                'category' => 'textile',
                'price' => 35.50,
                'image_url' => 'https://images.unsplash.com/photo-1606144042572-aca61147e1fd?w=800&q=80',
                'tags' => ['fashion', 'silk', 'handmade', 'apparel'],
            ],
            [
                'name' => 'Kandyan Moonstone Pendant',
                'short_description' => 'Elegant silver pendant featuring a genuine Sri Lankan moonstone in a traditional setting.',
                'category' => 'jewelry',
                'price' => 89.99,
                'image_url' => 'https://images.unsplash.com/photo-1599643478524-fb66f70d00cf?w=800&q=80',
                'tags' => ['silver', 'gemstone', 'luxury', 'gift'],
            ],
            [
                'name' => 'Organic Cinnamon Quills',
                'short_description' => 'Pure, sweet Ceylon cinnamon sourced directly from local spice gardens.',
                'category' => 'spice',
                'price' => 12.50,
                'image_url' => 'https://images.unsplash.com/photo-1608885623032-15f1025287e0?w=800&q=80',
                'tags' => ['culinary', 'organic', 'cooking'],
            ],
            [
                'name' => 'Traditional Clay Pottery Set',
                'short_description' => 'Rustic, hand-thrown terracotta bowls perfect for serving local curries.',
                'category' => 'pottery',
                'price' => 28.00,
                'image_url' => 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80',
                'tags' => ['kitchen', 'terracotta', 'handmade'],
            ],
            [
                'name' => 'Silver Kandyan Bangle',
                'short_description' => 'Heavy sterling silver bangle with intricate filigree work by master artisans.',
                'category' => 'jewelry',
                'price' => 120.00,
                'image_url' => 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',
                'tags' => ['silver', 'accessory', 'artisan'],
            ],
            [
                'name' => 'Cardamom & Clove Spice Pack',
                'short_description' => 'Essential whole spices for authentic Sri Lankan cooking, freshly harvested.',
                'category' => 'spice',
                'price' => 18.75,
                'image_url' => 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=800&q=80',
                'tags' => ['culinary', 'essential', 'aromatic'],
            ],
        ];

        foreach ($products as $product) {
            Product::query()->updateOrCreate(
                [
                    'location_id' => $kandy->id,
                    'name' => $product['name'],
                ],
                array_merge($product, ['location_id' => $kandy->id]),
            );
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Location;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Location::query()->updateOrCreate(
            ['slug' => 'kandy'],
            [
                'name' => 'Kandy',
                'description' => 'Discover the heart of Sri Lanka. Kandy is a cultural capital nestled in the hills, known for the Temple of the Tooth, lush tea estates, and vibrant traditional arts. Explore authentic local crafts, exquisite jewelry, and world-renowned Ceylon tea.',
                'hero_image' => 'https://images.unsplash.com/photo-1588614959060-4d144f28b207?q=80&w=2000&auto=format&fit=crop',
            ],
        );
    }
}

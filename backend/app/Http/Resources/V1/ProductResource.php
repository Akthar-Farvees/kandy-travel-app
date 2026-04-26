<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'short_description' => $this->short_description,
            'category' => $this->category,
            'price' => (float) $this->price,
            'formatted_price' => '$' . number_format($this->price, 2),
            'image_url' => $this->image_url,
            'tags' => $this->tags ?? [],
            'is_active' => (bool) $this->is_active,
            'location_id' => $this->location_id,
            'location' => $this->whenLoaded('location', fn () => [
                'id' => $this->location->id,
                'name' => $this->location->name,
                'slug' => $this->location->slug,
            ]),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}

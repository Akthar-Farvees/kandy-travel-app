<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    public const CATEGORIES = [
        'tea',
        'handicraft',
        'jewelry',
        'spice',
        'textile',
        'pottery',
    ];

    protected $fillable = [
        'location_id',
        'name',
        'short_description',
        'category',
        'price',
        'image_url',
        'tags',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'tags' => 'array',
        'is_active' => 'boolean',
    ];

    public function location(): BelongsTo
    {
        return $this->belongsTo(Location::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory(Builder $query, string $category): Builder
    {
        return $query->where('category', $category);
    }

    public function scopeByPriceRange(Builder $query, ?float $minPrice, ?float $maxPrice): Builder
    {
        if ($minPrice !== null) {
            $query->where('price', '>=', $minPrice);
        }

        if ($maxPrice !== null) {
            $query->where('price', '<=', $maxPrice);
        }

        return $query;
    }

    public function scopeSearch(Builder $query, string $term): Builder
    {
        $searchTerm = trim($term);
        $keywords = array_values(array_filter(preg_split('/\s+/', $searchTerm) ?: []));

        return $query->where(function (Builder $builder) use ($searchTerm, $keywords) {
            $builder
                ->where('name', 'like', "%{$searchTerm}%")
                ->orWhere('short_description', 'like', "%{$searchTerm}%")
                ->orWhere('category', 'like', "%{$searchTerm}%")
                ->orWhere('tags', 'like', "%{$searchTerm}%");

            foreach ($keywords as $keyword) {
                $builder->orWhere('tags', 'like', '%"'.$keyword.'"%');
            }
        });
    }
}

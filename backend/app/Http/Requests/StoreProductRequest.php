<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', Rule::in(Product::CATEGORIES)],
            'price' => ['required', 'numeric', 'min:0'],
            'location_id' => ['required', 'exists:locations,id'],
            'short_description' => ['required', 'string', 'max:500'],
            'image_url' => ['nullable', 'url'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}

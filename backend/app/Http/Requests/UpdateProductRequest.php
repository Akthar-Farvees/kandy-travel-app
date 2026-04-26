<?php

namespace App\Http\Requests;

use App\Models\Product;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->is_admin;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', 'string', Rule::in(Product::CATEGORIES)],
            'price' => ['sometimes', 'required', 'numeric', 'min:0'],
            'location_id' => ['sometimes', 'required', 'exists:locations,id'],
            'short_description' => ['sometimes', 'required', 'string', 'max:500'],
            'image_url' => ['sometimes', 'nullable', 'url'],
            'tags' => ['sometimes', 'nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }
}

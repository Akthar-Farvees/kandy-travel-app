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
            'image_url' => ['nullable', 'url', 'max:2048'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:5120'], // Max 5MB
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'is_active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * When an image file is uploaded, strip image_url so they don't conflict.
     */
    protected function prepareForValidation(): void
    {
        if ($this->hasFile('image')) {
            $this->request->remove('image_url');
        }
    }

    /**
     * Custom validation error messages.
     */
    public function messages(): array
    {
        return [
            'image.image' => 'The uploaded file must be a valid image (JPEG, PNG, GIF, or WebP).',
            'image.mimes' => 'The image must be a JPEG, PNG, JPG, GIF, or WebP file.',
            'image.max' => 'The image must not be larger than 5 MB.',
            'image_url.url' => 'The image URL must be a valid URL.',
        ];
    }
}

<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\LocationResource;
use App\Models\Location;
use Illuminate\Database\Eloquent\Builder;

class LocationController extends Controller
{
    public function show()
    {
        $location = Location::query()
            ->withCount([
                'products' => fn (Builder $query) => $query->active(),
            ])
            ->kandy()
            ->firstOrFail();

        return new LocationResource($location);
    }
}

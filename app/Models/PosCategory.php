<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosCategory extends Model
{
    protected $table = 'pos_categories';

    protected $fillable = [
        'name',
        'slug',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function products()
    {
        return $this->hasMany(PosProduct::class, 'category_id');
    }
}

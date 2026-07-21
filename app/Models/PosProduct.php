<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosProduct extends Model
{
    protected $table = 'pos_products';

    protected $fillable = [
        'category_id',
        'name',
        'sku',
        'stock',
        'price',
        'image',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'stock' => 'integer',
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(PosCategory::class, 'category_id');
    }

    public function orderItems()
    {
        return $this->hasMany(PosOrderItem::class, 'product_id');
    }
}

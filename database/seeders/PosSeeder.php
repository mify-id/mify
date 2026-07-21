<?php

namespace Database\Seeders;

use App\Models\PosCategory;
use App\Models\PosProduct;
use Illuminate\Database\Seeder;

class PosSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed Categories
        $cat1 = PosCategory::create([
            'name' => 'Coffee & Caffeine',
            'slug' => 'coffee-caffeine',
            'is_active' => true,
        ]);

        $cat2 = PosCategory::create([
            'name' => 'Signature Refreshers',
            'slug' => 'signature-refreshers',
            'is_active' => true,
        ]);

        $cat3 = PosCategory::create([
            'name' => 'Tech Bites & Pastry',
            'slug' => 'tech-bites-pastry',
            'is_active' => true,
        ]);

        // 2. Seed Products
        // Category 1: Coffee
        PosProduct::create([
            'category_id' => $cat1->id,
            'name' => 'Espresso Double Shot',
            'sku' => 'COF-ESP-01',
            'stock' => 99,
            'price' => 28000,
            'is_active' => true,
        ]);

        PosProduct::create([
            'category_id' => $cat1->id,
            'name' => 'Kopi Susu Gula Aren',
            'sku' => 'COF-KSG-02',
            'stock' => 150,
            'price' => 32000,
            'is_active' => true,
        ]);

        PosProduct::create([
            'category_id' => $cat1->id,
            'name' => 'Caramel Macchiato',
            'sku' => 'COF-MAC-03',
            'stock' => 80,
            'price' => 42000,
            'is_active' => true,
        ]);

        // Category 2: Refreshers
        PosProduct::create([
            'category_id' => $cat2->id,
            'name' => 'Lime Fizz',
            'sku' => 'REF-LIM-01',
            'stock' => 60,
            'price' => 25000,
            'is_active' => true,
        ]);

        PosProduct::create([
            'category_id' => $cat2->id,
            'name' => 'Matcha Latte Ice',
            'sku' => 'REF-MAT-02',
            'stock' => 75,
            'price' => 38000,
            'is_active' => true,
        ]);

        // Category 3: Pastry
        PosProduct::create([
            'category_id' => $cat3->id,
            'name' => 'Butter Croissant',
            'sku' => 'PAS-CRO-01',
            'stock' => 40,
            'price' => 26000,
            'is_active' => true,
        ]);

        PosProduct::create([
            'category_id' => $cat3->id,
            'name' => 'Fudgy Brownie',
            'sku' => 'PAS-BRO-02',
            'stock' => 35,
            'price' => 24000,
            'is_active' => true,
        ]);
    }
}

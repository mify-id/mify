<?php

namespace App\Http\Controllers;

use App\Models\PosCategory;
use App\Models\PosProduct;
use App\Models\PosOrder;
use App\Models\PosOrderItem;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;

class POSController extends Controller
{
    /**
     * Render the POS React Workspace.
     */
    public function index()
    {
        return Inertia::render('POS/Index');
    }

    /**
     * Get categories and products for the POS screen.
     */
    public function getData()
    {
        $categories = PosCategory::where('is_active', true)
            ->with(['products' => function ($query) {
                $query->where('is_active', true);
            }])
            ->get();

        return response()->json([
            'categories' => $categories
        ]);
    }

    /**
     * Process checkout order.
     */
    public function checkout(Request $request)
    {
        $request->validate([
            'customer_name' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:pos_products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'subtotal' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'paid_amount' => 'required|numeric|min:0',
            'change_amount' => 'required|numeric|min:0',
            'payment_method' => 'required|string|in:cash,qris,card',
        ]);

        try {
            DB::beginTransaction();

            $invoiceNumber = 'INV-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            // Create Order
            $order = PosOrder::create([
                'invoice_number' => $invoiceNumber,
                'customer_name' => $request->customer_name ?: 'Walk-in Customer',
                'subtotal' => $request->subtotal,
                'discount' => $request->discount,
                'tax' => $request->tax,
                'total' => $request->total,
                'paid_amount' => $request->paid_amount,
                'change_amount' => $request->change_amount,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
                'user_id' => auth()->id() ?: 1, // Fallback to 1 if no auth session
            ]);

            // Save items & update product stock
            foreach ($request->items as $item) {
                $product = PosProduct::lockForUpdate()->find($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock for product '{$product->name}' is insufficient.");
                }

                // Decrement Stock
                $product->decrement('stock', $item['quantity']);

                PosOrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'unit_price' => $product->price,
                    'total_price' => $product->price * $item['quantity'],
                ]);
            }

            // Create Audit Log
            AuditLog::create([
                'event' => "POS Order completed: {$invoiceNumber} (Total: Rp " . number_format($request->total, 0, ',', '.') . ")",
                'ip' => $request->ip() ?: '127.0.0.1',
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Transaction completed successfully.',
                'order' => $order->load('orderItems.product'),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
        }
    }
}

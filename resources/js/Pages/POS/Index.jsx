import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { 
    Plus, 
    Minus, 
    Trash, 
    User, 
    CreditCard, 
    QrCode, 
    Coins, 
    Check, 
    Receipt, 
    ShoppingBag,
    MagnifyingGlass,
    Percent
} from '@phosphor-icons/react';

export default function POSIndex() {
    // States
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState('');
    const [discountPercent, setDiscountPercent] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    // Fetch products and categories on mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(route('pos.data'));
            const data = await res.json();
            if (data.categories) {
                setCategories(data.categories);
            }
        } catch (err) {
            console.error("Failed to load products:", err);
            setErrorMsg("Could not fetch product catalog. Verify server connection.");
        }
    };

    // Derived Products List
    const allProducts = categories.flatMap(cat => 
        cat.products.map(prod => ({
            ...prod,
            category_slug: cat.slug,
            category_name: cat.name
        }))
    );

    const filteredProducts = allProducts.filter(prod => {
        const matchesCategory = selectedCategory === 'all' || prod.category_slug === selectedCategory;
        const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (prod.sku && prod.sku.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Cart Management
    const addToCart = (product) => {
        if (product.stock <= 0) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stock) return prev; // stock limit
                return prev.map(item => 
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === productId) {
                    const newQty = item.quantity + amount;
                    if (newQty <= 0) return null;
                    if (newQty > item.stock) return item; // stock limit
                    return { ...item, quantity: newQty };
                }
                return item;
            }).filter(Boolean);
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
        setCustomerName('');
        setDiscountPercent(0);
        setPaidAmount('');
        setErrorMsg('');
        setOrderSuccess(null);
    };

    // Totals Calculation
    const subtotal = cart.reduce((acc, item) => acc + (parseFloat(item.price) * item.quantity), 0);
    const discount = subtotal * (discountPercent / 100);
    const tax = (subtotal - discount) * 0.10; // 10% VAT
    const total = subtotal - discount + tax;
    const changeAmount = paidAmount ? Math.max(0, parseFloat(paidAmount) - total) : 0;

    // Checkout Submission
    const handleCheckout = async () => {
        if (cart.length === 0) return;
        
        const floatPaid = parseFloat(paidAmount);
        if (paymentMethod === 'cash' && (isNaN(floatPaid) || floatPaid < total)) {
            setErrorMsg("Paid amount must be equal to or greater than the total amount.");
            return;
        }

        setLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(route('pos.checkout'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    customer_name: customerName,
                    items: cart.map(item => ({
                        product_id: item.id,
                        quantity: item.quantity
                    })),
                    subtotal: subtotal,
                    discount: discount,
                    tax: tax,
                    total: total,
                    paid_amount: paymentMethod === 'cash' ? floatPaid : total,
                    change_amount: paymentMethod === 'cash' ? (floatPaid - total) : 0,
                    payment_method: paymentMethod
                })
            });

            const result = await response.json();

            if (result.success) {
                setOrderSuccess(result.order);
                setCart([]);
                setCustomerName('');
                setPaidAmount('');
                // Refresh local stock amounts
                fetchData();
            } else {
                setErrorMsg(result.message || "Failed to process order.");
            }
        } catch (err) {
            console.error("Checkout error:", err);
            setErrorMsg("Internal checkout error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Format currency Helper
    const formatRp = (val) => {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(val);
    };

    return (
        <AdminLayout activeTab="pos" title="POS Cashier Terminal">
            <Head title="POS Cashier Terminal" />
            
            <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[calc(100vh-64px)] relative z-10 w-full">
                
                {/* Catalog Grid Left Side */}
                <div className="flex-1 flex flex-col gap-6">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime">
                                Live POS Terminal
                            </span>
                            <h1 className="font-extrabold text-3xl tracking-tight text-white leading-tight">
                                Point of <span className="text-brand-lime">Sale</span>
                            </h1>
                        </div>

                        {/* Search Bar */}
                        <div className="relative w-full sm:w-72">
                            <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                            <input 
                                type="text"
                                placeholder="Search SKU or item name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 hover:border-white/20 focus:border-brand-lime focus:outline-none rounded-xl text-sm text-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Category Scrollable Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide uppercase transition-all shrink-0 ${
                                selectedCategory === 'all'
                                    ? 'bg-brand-lime text-brand-dark shadow-[0_4px_15px_rgba(181,255,0,0.15)] hover:scale-[1.02]'
                                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                            }`}
                        >
                            All Products
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.slug)}
                                className={`px-5 py-2.5 rounded-full text-xs font-black tracking-wide uppercase transition-all shrink-0 ${
                                    selectedCategory === cat.slug
                                        ? 'bg-brand-lime text-brand-dark shadow-[0_4px_15px_rgba(181,255,0,0.15)] hover:scale-[1.02]'
                                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/5'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Product Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredProducts.map((prod) => {
                            const isOutOfStock = prod.stock <= 0;
                            const cartItem = cart.find(item => item.id === prod.id);
                            const cartQty = cartItem ? cartItem.quantity : 0;
                            const effectiveStock = prod.stock - cartQty;

                            return (
                                <div 
                                    key={prod.id}
                                    onClick={() => !isOutOfStock && effectiveStock > 0 && addToCart(prod)}
                                    className={`bg-white/5 border border-white/10 rounded-[24px] p-6 group transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[200px] ${
                                        isOutOfStock || effectiveStock <= 0
                                            ? 'opacity-50 cursor-not-allowed'
                                            : 'cursor-pointer hover:bg-white/10 hover:border-brand-blue/30 hover:scale-[1.02]'
                                    }`}
                                >
                                    {/* Accent Blue/Lime Glow */}
                                    <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-brand-blue/5 blur-xl group-hover:bg-brand-blue/10 transition-all" />

                                    <div>
                                        {/* SKU Badge */}
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-mono tracking-wider bg-white/10 text-white/60 px-2.5 py-1 rounded-md">
                                                {prod.sku || 'NO SKU'}
                                            </span>
                                            
                                            {/* Category Sticker */}
                                            <span className="text-[9px] font-black uppercase tracking-widest text-brand-lime">
                                                {prod.category_name}
                                            </span>
                                        </div>

                                        {/* Product Title */}
                                        <h3 className="font-bold text-lg text-white leading-tight mb-1">
                                            {prod.name}
                                        </h3>

                                        {/* Stock Counter */}
                                        <div className="text-xs text-white/50 mb-2">
                                            Stock: <span className={effectiveStock <= 5 ? "text-red-400 font-extrabold" : "text-white/70"}>{effectiveStock} left</span>
                                        </div>
                                    </div>

                                    {/* Price & Buy Section */}
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="font-extrabold text-xl text-white">
                                            {formatRp(prod.price)}
                                        </span>
                                        
                                        {/* Dynamic cart qty badge */}
                                        {cartQty > 0 && (
                                            <span className="bg-brand-lime text-brand-dark font-black px-2.5 py-1 rounded-full text-xs">
                                                {cartQty}x
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-full py-16 text-center text-white/40 font-bold border border-white/5 border-dashed rounded-[24px]">
                                No items found matching search filters.
                            </div>
                        )}
                    </div>
                </div>

                {/* Cashier Sidebar Basket Right Side */}
                <div className="w-full lg:w-[420px] bg-white/5 border border-white/10 rounded-[24px] p-6 flex flex-col justify-between max-h-[calc(100vh-100px)] relative overflow-hidden">
                    {/* Background glow in sidebar basket */}
                    <div className="absolute -left-12 -bottom-12 w-32 h-32 rounded-full bg-brand-lime/5 blur-xl pointer-events-none" />

                    <div>
                        {/* Title and Clear controls */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5 text-brand-lime" />
                                <h2 className="font-extrabold text-xl text-white">Order Cart</h2>
                            </div>
                            {cart.length > 0 && (
                                <button 
                                    onClick={clearCart}
                                    className="text-[10px] uppercase tracking-widest font-black text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
                                >
                                    <Trash className="w-3.5 h-3.5" /> Clear
                                </button>
                            )}
                        </div>

                        {/* Customer Info Form */}
                        <div className="mb-4">
                            <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5 block">
                                Customer Reference (Optional)
                            </label>
                            <input 
                                type="text"
                                placeholder="Walk-in Customer"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 focus:border-brand-lime focus:outline-none rounded-xl text-xs text-white transition-all"
                            />
                        </div>

                        {/* Scrollable Cart Items Container */}
                        <div className="flex-1 overflow-y-auto max-h-[220px] border-y border-white/5 py-4 my-4 scrollbar-thin">
                            {cart.map((item) => (
                                <div key={item.id} className="flex items-center justify-between gap-4 py-2 border-b border-white/5 last:border-b-0">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm text-white truncate">{item.name}</h4>
                                        <span className="text-xs text-white/50">{formatRp(item.price)} each</span>
                                    </div>

                                    {/* Action Buttons to increment/decrement */}
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-7 h-7 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center transition-all active:scale-95"
                                        >
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="text-sm font-black w-6 text-center text-white">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-7 h-7 bg-white/5 hover:bg-white/10 text-white rounded-lg flex items-center justify-center transition-all active:scale-95"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                        <button 
                                            onClick={() => removeFromCart(item.id)}
                                            className="w-7 h-7 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center transition-all active:scale-95 ml-1"
                                        >
                                            <Trash className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {cart.length === 0 && (
                                <div className="py-8 text-center text-xs text-white/30 font-semibold italic">
                                    Cart is empty. Click catalog cards to add.
                                </div>
                            )}
                        </div>

                        {/* Interactive Discount Selector */}
                        {cart.length > 0 && (
                            <div className="mb-4">
                                <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5 block">
                                    Discount Highlight
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[0, 5, 10, 20].map((pct) => (
                                        <button
                                            key={pct}
                                            onClick={() => setDiscountPercent(pct)}
                                            className={`py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                                                discountPercent === pct
                                                    ? 'bg-brand-lime text-brand-dark font-black'
                                                    : 'bg-white/5 hover:bg-white/10 text-white'
                                            }`}
                                        >
                                            {pct}%
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Receipt Calculation & Actions */}
                    <div>
                        <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-2.5 mb-6 text-xs border border-white/5">
                            <div className="flex justify-between text-white/60">
                                <span>Subtotal</span>
                                <span className="font-bold">{formatRp(subtotal)}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-brand-lime font-bold">
                                    <span>Discount ({discountPercent}%)</span>
                                    <span>-{formatRp(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-white/60">
                                <span>Tax (VAT 10%)</span>
                                <span className="font-bold">{formatRp(tax)}</span>
                            </div>
                            <div className="h-px bg-white/10 my-1" />
                            <div className="flex justify-between text-sm text-white font-extrabold">
                                <span>Total Bill</span>
                                <span className="text-brand-lime text-base">{formatRp(total)}</span>
                            </div>
                        </div>

                        {cart.length > 0 && (
                            <div className="flex flex-col gap-4">
                                {/* Payment Method selectors */}
                                <div>
                                    <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1.5 block">
                                        Payment Method
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button
                                            onClick={() => setPaymentMethod('cash')}
                                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                                paymentMethod === 'cash'
                                                    ? 'bg-brand-blue/20 text-white border border-brand-blue'
                                                    : 'bg-white/5 hover:bg-white/10 text-white border border-transparent'
                                            }`}
                                        >
                                            <Coins className="w-4 h-4" />
                                            Cash
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('qris')}
                                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                                paymentMethod === 'qris'
                                                    ? 'bg-brand-blue/20 text-white border border-brand-blue'
                                                    : 'bg-white/5 hover:bg-white/10 text-white border border-transparent'
                                            }`}
                                        >
                                            <QrCode className="w-4 h-4" />
                                            QRIS
                                        </button>
                                        <button
                                            onClick={() => setPaymentMethod('card')}
                                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1.5 ${
                                                paymentMethod === 'card'
                                                    ? 'bg-brand-blue/20 text-white border border-brand-blue'
                                                    : 'bg-white/5 hover:bg-white/10 text-white border border-transparent'
                                            }`}
                                        >
                                            <CreditCard className="w-4 h-4" />
                                            Card
                                        </button>
                                    </div>
                                </div>

                                {/* Paid Amount input for cash payments */}
                                {paymentMethod === 'cash' && (
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1 block">
                                                Paid Amount (Rp)
                                            </label>
                                            <input 
                                                type="number"
                                                placeholder="e.g. 50000"
                                                value={paidAmount}
                                                onChange={(e) => setPaidAmount(e.target.value)}
                                                className="w-full px-4 py-2 bg-white/5 border border-white/10 focus:border-brand-lime focus:outline-none rounded-xl text-xs text-white transition-all font-mono"
                                            />
                                        </div>
                                        {paidAmount && (
                                            <div className="text-right shrink-0">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1 block">
                                                    Change
                                                </span>
                                                <span className="text-brand-lime font-mono font-bold text-xs block">
                                                    {formatRp(changeAmount)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Error messages */}
                                {errorMsg && (
                                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-3 rounded-xl font-bold leading-tight">
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Checkout CTA */}
                                <button 
                                    onClick={handleCheckout}
                                    disabled={loading}
                                    className="w-full py-4 bg-brand-lime text-brand-dark font-extrabold rounded-full hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 shadow-[0_4px_25px_rgba(181,255,0,0.2)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing transaction...' : 'Execute Transaction'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Success Receipt Popup Modal */}
            {orderSuccess && (
                <div className="fixed inset-0 bg-brand-dark/85 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <div className="bg-[#131b2e] border border-brand-lime/20 rounded-[24px] max-w-md w-full p-8 shadow-[0_10px_50px_rgba(181,255,0,0.05)] relative overflow-hidden flex flex-col gap-6 animate-in fade-in zoom-in duration-300">
                        {/* Glow */}
                        <div className="absolute -right-12 -top-12 w-28 h-28 rounded-full bg-brand-lime/10 blur-xl pointer-events-none" />

                        {/* Top check indicator */}
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-lime/20 border border-brand-lime/20 flex items-center justify-center text-brand-lime shrink-0">
                                <Check className="w-6 h-6" weight="bold" />
                            </div>
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-brand-lime">
                                    Checkout Success
                                </span>
                                <h3 className="font-extrabold text-xl text-white">Invoice Printed</h3>
                            </div>
                        </div>

                        {/* Invoice Specs */}
                        <div className="bg-brand-dark/50 border border-white/5 rounded-2xl p-4 font-mono text-[11px] leading-relaxed flex flex-col gap-1.5 text-white/70">
                            <div className="flex justify-between border-b border-white/5 pb-2 mb-2 font-bold text-white text-xs">
                                <span>INVOICE</span>
                                <span className="text-brand-lime">{orderSuccess.invoice_number}</span>
                            </div>
                            <div>Date: {new Date(orderSuccess.created_at).toLocaleString('id-ID')}</div>
                            <div>Cashier ID: #{orderSuccess.user_id}</div>
                            <div>Customer: {orderSuccess.customer_name}</div>
                            <div className="h-px bg-white/5 my-2" />
                            
                            {/* Items List */}
                            <div className="flex flex-col gap-1 max-h-[100px] overflow-y-auto pr-1">
                                {orderSuccess.order_items?.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-white/50">
                                        <span>{item.quantity}x {item.product?.name}</span>
                                        <span>{formatRp(item.total_price)}</span>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="h-px bg-white/5 my-2" />
                            <div className="flex justify-between font-bold text-white text-xs">
                                <span>TOTAL PAID</span>
                                <span className="text-brand-lime">{formatRp(orderSuccess.total)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Payment Type</span>
                                <span className="uppercase">{orderSuccess.payment_method}</span>
                            </div>
                        </div>

                        {/* Back button */}
                        <button 
                            onClick={clearCart}
                            className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-full border border-white/10 hover:border-white/20 transition-all duration-200 text-center active:scale-95"
                        >
                            Return to Catalog
                        </button>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}

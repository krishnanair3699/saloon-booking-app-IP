import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, MapPin, Trash2, Tag, Home, ShoppingCart, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import blueLotusLogo from 'figma:asset/a35e5e2591b4780b92aa64729c88b63455161394.png';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-86f09702`;

// Checkout page with cart and coupon functionality
interface CartItem {
  id: number;
  customerid: number;
  massageid: number;
  massage: {
    id: number;
    name: string;
    price: number;
    duration: string;
    massage_zone: string;
    description: string;
  };
  quantity: number;
  transactiondate: string;
}

export function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, accessToken, user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to continue');
      navigate('/auth');
      return;
    }
    
    fetchCartItems();
  }, [isAuthenticated]);

  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`${API_BASE}/cart/items`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': accessToken!
        }
      });

      const data = await response.json();
      console.log('=== CART ITEMS FETCHED ===');
      console.log('Response status:', response.status);
      console.log('Response data:', data);
      console.log('Number of items:', data.items?.length || 0);
      
      if (data.items && data.items.length > 0) {
        console.log('Cart items with prices:');
        data.items.forEach((item: CartItem, index: number) => {
          console.log(`  Item ${index + 1}:`, {
            id: item.id,
            massageId: item.massageid,
            massageName: item.massage?.name,
            massagePrice: item.massage?.price,
            quantity: item.quantity,
            // Check if amount exists in cart_master
            cartAmount: (item as any).amount
          });
        });
      }
      
      if (response.ok) {
        setCartItems(data.items || []);
      } else {
        toast.error('Failed to load cart items');
      }
    } catch (error) {
      console.error('Failed to fetch cart items:', error);
      toast.error('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`${API_BASE}/cart/remove/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-User-Token': accessToken!
        }
      });

      if (response.ok) {
        toast.success('Item removed from cart');
        fetchCartItems();
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast.error('Failed to remove item');
    }
  };

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRSTTIME15') {
      setDiscount(15);
      setCouponApplied(true);
      toast.success('Coupon applied! 15% discount');
    } else {
      toast.error('Invalid coupon code');
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.massage?.price || 0) * item.quantity, 0);
  const discountAmount = (subtotal * discount) / 100;
  const total = subtotal - discountAmount;

  // Debug calculation
  console.log('=== CART CALCULATION ===');
  console.log('Cart items count:', cartItems.length);
  console.log('Subtotal:', subtotal);
  console.log('Discount percentage:', discount);
  console.log('Discount amount:', discountAmount);
  console.log('Total:', total);
  console.log('Individual prices:');
  cartItems.forEach((item, idx) => {
    console.log(`  ${idx + 1}. ${item.massage?.name}: ₹${item.massage?.price} × ${item.quantity} = ₹${(item.massage?.price || 0) * item.quantity}`);
  });

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    console.log('=== PROCEED TO PAYMENT CLICKED ===');
    console.log('Subtotal:', subtotal);
    console.log('Discount:', discount);
    console.log('Discount Amount:', discountAmount);
    console.log('Total:', total);
    console.log('Coupon Code:', couponCode);
    console.log('Coupon Applied:', couponApplied);
    console.log('Cart Items:', cartItems);
    console.log('Cart Items with prices:');
    cartItems.forEach((item, index) => {
      console.log(`  Item ${index + 1}:`, {
        id: item.id,
        massageId: item.massageid,
        massageName: item.massage?.name,
        massagePrice: item.massage?.price,
        quantity: item.quantity,
        subtotal: (item.massage?.price || 0) * item.quantity
      });
    });
    console.log('State being passed:', { 
      total, 
      subtotal,
      discount,
      discountAmount,
      couponCode: couponApplied ? couponCode : '',
      cartItems
    });

    // Prevent navigation if total is 0
    if (total === 0 || subtotal === 0) {
      console.error('ERROR: Cannot proceed with ₹0 payment!');
      toast.error('Cart total is ₹0. Please check your cart items.');
      return;
    }

    // Navigate to payment gateway page
    navigate('/payment', { 
      state: { 
        total, 
        subtotal,
        discount,
        discountAmount,
        couponCode: couponApplied ? couponCode : '',
        cartItems 
      } 
    });
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg shadow-sm border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/')}
                className="p-2 hover:bg-blue-100 rounded-full transition-colors"
                title="Go to Home"
              >
                <Home className="w-5 h-5 text-blue-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => navigate('/services')}
                className="p-2 hover:bg-orange-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <img src={blueLotusLogo} alt="Savadhika" className="h-10 w-10" />
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-archive)' }}>
                SAVADHIKA
              </h1>
            </div>
            {user && (
              <div className="hidden sm:block text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-semibold text-orange-600">{user.name}</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items - Left Side (2/3) */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                </div>

                {isLoading ? (
                  <div className="text-center py-16">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent"></div>
                    <p className="text-gray-500 mt-4">Loading cart...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-16">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6 text-lg">Your cart is empty</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/services')}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold"
                    >
                      Browse Services
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 sm:p-5 border border-orange-100 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg mb-2">
                              {item.massage?.name || 'Unknown Service'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2">
                              {item.massage?.duration} • {item.massage?.massage_zone}
                            </p>
                            <p className="text-orange-600 font-bold text-xl">
                              ₹{item.massage?.price || 0}
                            </p>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item.id)}
                            className="self-end sm:self-start p-2 hover:bg-red-100 rounded-full transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5 text-red-600" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* Order Summary - Right Side (1/3) */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 sticky top-24"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                  Order Summary
                </h2>

                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="FIRSTTIME15"
                        disabled={couponApplied}
                        className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={applyCoupon}
                      disabled={couponApplied}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Apply
                    </motion.button>
                  </div>
                  {couponApplied && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-green-600 text-sm mt-2 flex items-center gap-1"
                    >
                      <span className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
                      Coupon applied successfully!
                    </motion.p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-700">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="flex justify-between text-green-600"
                    >
                      <span className="font-medium">Discount ({discount}%)</span>
                      <span className="font-semibold">-₹{discountAmount.toFixed(2)}</span>
                    </motion.div>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-orange-100">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-orange-600">₹{total.toFixed(2)}</span>
                </div>

                {/* Payment Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing || cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <CreditCard className="w-5 h-5" />
                  {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                </motion.button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  🔒 Secure payment powered by Razorpay
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
import { motion } from 'motion/react';
import { ArrowLeft, Clock, MapPin, Plus, ShoppingCart, Trash2, LogIn, Home } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { DiscountScroller } from '../components/DiscountScroller';
import { LanguageSelector } from '../components/LanguageSelector';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '/utils/supabase/info';
import blueLotusLogo from 'figma:asset/a35e5e2591b4780b92aa64729c88b63455161394.png';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-86f09702`;

// Services page component
export function Services() {
  const navigate = useNavigate();
  const { bookingData, updateBooking } = useBooking();
  const { isAuthenticated, accessToken, user } = useAuth();
  const [cart, setCart] = useState<any[]>([]);
  const [massages, setMassages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const bodyArea = bookingData.bodyArea || 'lower';

  // Fetch massages from database
  useEffect(() => {
    const fetchMassages = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching massages from API...');
        console.log('Body area:', bodyArea);
        
        const response = await fetch(`${API_BASE}/massages`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to fetch massages:', response.status, errorText);
          setMassages([]);
          setIsLoading(false);
          return;
        }

        const data = await response.json();
        console.log('Fetched massages data:', data);
        
        // Map massage_master data to the format expected by the UI
        // Filter by massagetype based on bodyArea selection
        const massageTypeMap = {
          'lower': 'Lower Back',
          'torso': 'Torso',
          'upper': 'Upper Body'
        };
        
        const filteredMassages = (data.massages || [])
          .filter((m: any) => m.massagetype === massageTypeMap[bodyArea])
          .map((m: any) => ({
            id: m.id,
            name: m.massagename,
            body_area: bodyArea,
            price: m.price,
            duration: `${m.duration} min`,
            massage_zone: m.massagezone,
            description: m.description || m.Description
          }));
        
        console.log('Filtered massages:', filteredMassages);
        setMassages(filteredMassages);
      } catch (error) {
        console.error('Failed to fetch massages:', error);
        setMassages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMassages();
  }, [bodyArea]);

  // Fetch cart if authenticated
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchCart();
    }
  }, [isAuthenticated, accessToken]);

  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_BASE}/cart`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();
      setCart(data.cart || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    }
  };

  const addToCart = async (massage: any) => {
    if (isAddingToCart) {
      return; // Prevent multiple clicks
    }
    
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      navigate('/auth');
      return;
    }

    if (!massage.id) {
      console.error('Massage object missing ID:', massage);
      toast.error('Invalid massage data');
      return;
    }

    setIsAddingToCart(true);

    try {
      console.log('Adding to cart:', massage.id);
      console.log('User token:', accessToken);
      
      const response = await fetch(`${API_BASE}/cart/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`, // Required by Supabase Edge Functions
          'X-User-Token': accessToken! // Custom header for user identification
        },
        body: JSON.stringify({ massage_id: massage.id })
      });

      console.log('Add to cart response status:', response.status);
      const data = await response.json();
      console.log('Add to cart response data:', data);

      if (response.ok && data.success) {
        toast.success(`${massage.name} added to cart!`);
        
        // Store the massage in booking context
        updateBooking({ services: [massage] });
        
        // Small delay for toast to show, then navigate
        setTimeout(() => {
          navigate('/checkout');
        }, 300);
      } else {
        setIsAddingToCart(false);
        console.error('Failed to add to cart:', data);
        
        // Show detailed error message
        let errorMessage = 'Failed to add to cart';
        if (data.error) {
          errorMessage = data.error;
        }
        if (data.errorCode === '42P01' || data.message?.includes('does not exist')) {
          errorMessage = 'Database table not created. Please run the SQL setup in Supabase Dashboard.';
        }
        
        toast.error(errorMessage);
        
        // Also log to console for debugging
        console.error('Error details:', {
          message: data.message,
          error: data.error,
          errorCode: data.errorCode,
          errorHint: data.errorHint,
          details: data.details
        });
      }
    } catch (error) {
      setIsAddingToCart(false);
      console.error('Failed to add to cart - exception:', error);
      toast.error(`Failed to add to cart: ${error.message}`);
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      const response = await fetch(`${API_BASE}/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        toast.success('Item removed from cart');
        await fetchCart();
      } else {
        toast.error('Failed to remove item');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error('Failed to remove item');
    }
  };

  const proceedToBooking = () => {
    if (cart.length === 0) {
      toast.error('Please add at least one service to cart');
      return;
    }
    
    // Store cart items in booking context
    updateBooking({ services: cart.map(item => item.massage) });
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Discount Scroller */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DiscountScroller />
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-blue-50 rounded-full transition-colors"
              title="Go to Home"
            >
              <Home className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={() => navigate('/body-area')}
              className="p-2 hover:bg-pink-50 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <img src={blueLotusLogo} alt="Savadhika Logo" className="h-12 w-12" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-800 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-archive)' }}>
              SAVADHIKA
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated && user && (
              <>
                <div className="text-sm text-gray-700">
                  <span className="text-gray-500">Welcome, </span>
                  <span className="font-semibold text-pink-600">{user.name}</span>
                </div>
                <button
                  onClick={() => {
                    console.log('=== FORCING LOGOUT ===');
                    console.log('Current token before clear:', localStorage.getItem('accessToken'));
                    localStorage.clear();
                    toast.success('Logged out. Please sign in again.');
                    window.location.href = '/auth';
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-semibold"
                >
                  Logout & Refresh Session
                </button>
              </>
            )}
            {!isAuthenticated && (
              <button
                onClick={() => navigate('/auth')}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-semibold flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            )}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-4 text-gray-800"
            style={{ fontFamily: 'Averia Serif Libre, serif' }}
          >
            {bodyArea === 'lower' ? 'Lower Body' : bodyArea === 'torso' ? 'Torso' : 'Upper Body'} Massages
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-600 mb-12 text-lg"
          >
            Select your wellness services
          </motion.p>

          {/* Service Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {isLoading ? (
              <div className="col-span-2 text-center">
                <p className="text-gray-500">Loading services...</p>
              </div>
            ) : (
              massages.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                  style={{ 
                    boxShadow: '8px 8px 16px rgba(251, 191, 36, 0.15), -8px -8px 16px rgba(255, 255, 255, 0.9)'
                  }}
                >
                  <div className="p-8">
                    {/* Service Name */}
                    <h3 
                      className="text-2xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: 'Averia Serif Libre, serif' }}
                    >
                      {service.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 mb-6">
                      {service.description}
                    </p>

                    {/* Service Details */}
                    <div className="space-y-3 mb-6">
                      {/* Price */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <span className="text-orange-600 font-bold">₹</span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-lg font-bold text-gray-800">₹{service.price}</p>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Duration</p>
                          <p className="text-lg font-bold text-gray-800">{service.duration}</p>
                        </div>
                      </div>

                      {/* Massage Zone */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Massage Zone</p>
                          <p className="text-lg font-bold text-gray-800">{service.massage_zone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setIsAddingToCart(true);
                        addToCart(service);
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      {isAddingToCart ? (
                        <Plus className="w-5 h-5 animate-spin" />
                      ) : (
                        <Plus className="w-5 h-5" />
                      )}
                      Add to Cart
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Cart Summary & Proceed Button */}
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-6 left-6 right-6 max-w-4xl mx-auto bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <ShoppingCart className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-white font-bold text-lg">
                      {cart.length} {cart.length === 1 ? 'service' : 'services'} in cart
                    </p>
                    <p className="text-orange-100 text-sm">
                      Total: ₹{cart.reduce((sum, s) => sum + s.massage.price, 0)}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={proceedToBooking}
                  className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors"
                >
                  Proceed to Booking
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
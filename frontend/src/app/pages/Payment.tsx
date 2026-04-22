import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, CheckCircle, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { LanguageSelector } from '../components/LanguageSelector';
import { DiscountScroller } from '../components/DiscountScroller';
import { AuthModal } from '../components/AuthModal';
import blueLotusLogo from 'figma:asset/a35e5e2591b4780b92aa64729c88b63455161394.png';

export function Payment() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { bookingData, updateBooking, usedCoupons, applyCoupon } = useBooking();
  const { isAuthenticated, user } = useAuth();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!bookingData.city || !bookingData.service || !bookingData.name) {
      navigate('/');
    }
  }, [bookingData.city, bookingData.service, bookingData.name, navigate]);

  const baseAmount = bookingData.service.price;
  const discount = bookingData.couponApplied ? baseAmount * 0.15 : 0;
  const finalAmount = baseAmount - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'FIRSTTIME15') {
      if (bookingData.phone && usedCoupons.has(bookingData.phone)) {
        setCouponError('This coupon has already been used with this phone number');
      } else if (bookingData.phone && applyCoupon(bookingData.phone)) {
        updateBooking({ couponApplied: true });
        setCouponError('');
      }
    } else {
      setCouponError('Invalid coupon code');
    }
  };

  const handleConfirmBooking = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      setShowPaymentForm(true);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const validatePayment = () => {
    // Dummy card validation
    const validCards = ['4111111111111111', '5500000000000004', '340000000000009'];
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (!cardName) {
      setPaymentError('Please enter cardholder name');
      return false;
    }
    if (cleanCardNumber.length < 15) {
      setPaymentError('Invalid card number');
      return false;
    }
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setPaymentError('Invalid expiry date (MM/YY)');
      return false;
    }
    if (cvv.length !== 3 && cvv.length !== 4) {
      setPaymentError('Invalid CVV');
      return false;
    }
    
    setPaymentError('');
    return true;
  };

  const handlePayment = () => {
    if (!validatePayment()) {
      return;
    }
    
    setIsProcessing(true);
    setPaymentError('');
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmation(true);
    }, 2000);
  };

  if (showConfirmation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 via-blue-50 to-cream-100 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          >
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          </motion.div>
          
          <h2 className="text-5xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'var(--font-archive)' }}>
            {t('bookingConfirmed')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('thankYou')}
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Booking Summary</h3>
            <div className="space-y-2 text-gray-600">
              <p><span className="font-medium">Service:</span> {bookingData.service.name}</p>
              <p><span className="font-medium">Location:</span> {t(bookingData.city)}</p>
              <p><span className="font-medium">Date:</span> {bookingData.date}</p>
              <p><span className="font-medium">Time:</span> {bookingData.time}</p>
              <p><span className="font-medium">Name:</span> {bookingData.name}</p>
              <p><span className="font-medium">Amount Paid:</span> ₹{finalAmount}</p>
            </div>
          </div>
          
          <p className="text-gray-600 mb-8">
            {t('confirmationSent')}
          </p>
          
          <button
            onClick={() => {
              navigate('/');
              window.location.reload();
            }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
          >
            {t('backToHome')}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-blue-50 to-cream-100">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/booking')}
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
              <div className="text-sm text-gray-700">
                <span className="text-gray-500">Welcome, </span>
                <span className="font-semibold text-pink-600">{user.name}</span>
              </div>
            )}
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-44 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
              {t('payment')}
            </h2>

            {/* Booking Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>{t('service')}:</span>
                  <span className="font-semibold">{bookingData.service.name}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('location')}:</span>
                  <span className="font-semibold">{t(bookingData.city)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('date')}:</span>
                  <span className="font-semibold">{bookingData.date}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('time')}:</span>
                  <span className="font-semibold">{bookingData.time}</span>
                </div>
              </div>

              <div className="border-t pt-6">
                <div className="flex justify-between text-lg mb-2">
                  <span>{t('total')}:</span>
                  <span className="font-semibold">₹{baseAmount}</span>
                </div>
                {bookingData.couponApplied && (
                  <div className="flex justify-between text-lg text-green-600 mb-2">
                    <span>{t('discount')} (15%):</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-2xl font-bold text-blue-600 mt-4">
                  <span>{t('finalAmount')}:</span>
                  <span>₹{finalAmount}</span>
                </div>
              </div>
            </div>

            {/* Coupon Code */}
            {!bookingData.couponApplied && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {t('couponCode')}
                </h3>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Enter coupon code"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    {t('apply')}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-2">{couponError}</p>
                )}
                <p className="text-sm text-gray-500 mt-3">
                  Use code <span className="font-mono font-semibold">FIRSTTIME15</span> for 15% off on your first booking
                </p>
              </div>
            )}

            {/* Payment Method */}
            {showPaymentForm && (
              <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  Payment Method
                </h3>
                <div className="space-y-3">
                  <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center">
                      <CreditCard className="w-5 h-5 text-blue-600 mr-3" />
                      <span className="font-semibold text-gray-800">Card Payment</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 opacity-50">
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-3 bg-gray-300 rounded"></div>
                      <span className="text-gray-600">UPI (Coming Soon)</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 opacity-50">
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-3 bg-gray-300 rounded"></div>
                      <span className="text-gray-600">Net Banking (Coming Soon)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-yellow-800 font-semibold mb-2">🧪 Test Card Details (For Demo Only):</p>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Visa: <span className="font-mono">4111 1111 1111 1111</span></li>
                      <li>• Mastercard: <span className="font-mono">5500 0000 0000 0004</span></li>
                      <li>• Amex: <span className="font-mono">3400 0000 0000 009</span></li>
                      <li>• Any name, future expiry date (e.g., 12/25), and any 3-digit CVV</li>
                    </ul>
                  </div>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Card Number"
                    maxLength={19}
                  />
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all mt-3"
                    placeholder="Cardholder Name"
                  />
                  <div className="flex gap-3 mt-3">
                    <input
                      type="text"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                    <input
                      type="text"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="CVV"
                      maxLength={4}
                    />
                  </div>
                  {paymentError && (
                    <p className="text-red-500 text-sm mt-2">{paymentError}</p>
                  )}
                </div>
              </div>
            )}

            {!showPaymentForm && (
              <button
                onClick={handleConfirmBooking}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]"
              >
                {t('confirmBooking')} - ₹{finalAmount}
              </button>
            )}

            {showPaymentForm && (
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Pay ₹{finalAmount} Securely
                  </>
                )}
              </button>
            )}
          </motion.div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          setShowConfirmation(true);
        }}
      />
    </div>
  );
}
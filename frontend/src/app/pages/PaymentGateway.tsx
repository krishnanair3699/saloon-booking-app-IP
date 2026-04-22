import { motion } from 'motion/react';
import { ArrowLeft, CreditCard, Smartphone, Building2, Wallet, Clock, Shield, CheckCircle2, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const upiApps = [
  { id: 'gpay', name: 'Google Pay', icon: '🔵', color: 'bg-blue-50 hover:bg-blue-100 border-blue-200' },
  { id: 'phonepe', name: 'PhonePe', icon: '🟣', color: 'bg-purple-50 hover:bg-purple-100 border-purple-200' },
  { id: 'paytm', name: 'Paytm', icon: '🔷', color: 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200' },
  { id: 'bhim', name: 'BHIM UPI', icon: '🟠', color: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
];

const wallets = [
  { id: 'paytm-wallet', name: 'Paytm Wallet', icon: '💳' },
  { id: 'phonepe-wallet', name: 'PhonePe Wallet', icon: '💰' },
  { id: 'mobikwik', name: 'Mobikwik', icon: '🔴' },
  { id: 'freecharge', name: 'Freecharge', icon: '🟡' },
  { id: 'amazon-pay', name: 'Amazon Pay', icon: '🟠' },
];

const banks = [
  'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda',
  'Canara Bank', 'Union Bank of India', 'IndusInd Bank'
];

const payLaterOptions = [
  { id: 'lazypay', name: 'LazyPay', icon: '⚡', desc: 'Pay in 15 days' },
  { id: 'simpl', name: 'Simpl', icon: '🎯', desc: 'Pay in 15 days' },
  { id: 'zestmoney', name: 'ZestMoney', icon: '💎', desc: 'EMI starting ₹333/month' },
];

export function PaymentGateway() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Store state in component state to preserve it
  const [paymentData, setPaymentData] = useState(() => {
    const state = location.state as any;
    console.log('=== PAYMENT GATEWAY INITIALIZED ===');
    console.log('Location:', location);
    console.log('Location state:', state);
    
    if (!state) {
      console.warn('⚠️ No state found, will redirect to checkout');
    }
    
    return {
      total: state?.total || 0,
      subtotal: state?.subtotal || 0,
      discount: state?.discount || 0,
      discountAmount: state?.discountAmount || 0,
      couponCode: state?.couponCode || '',
      cartItems: state?.cartItems || []
    };
  });

  const { total, subtotal, discount, discountAmount, couponCode, cartItems } = paymentData;

  // Debug logging
  console.log('=== PAYMENT DATA ===');
  console.log('Total:', total);
  console.log('Subtotal:', subtotal);
  console.log('Discount:', discount);
  console.log('Discount Amount:', discountAmount);
  console.log('Coupon code:', couponCode);
  console.log('Cart items:', cartItems);
  console.log('Cart items length:', cartItems?.length);

  // Only redirect if there's truly no state AND no data
  useEffect(() => {
    const state = location.state as any;
    if (!state && cartItems.length === 0) {
      console.error('❌ No payment state and no cart items - redirecting to checkout');
      toast.error('Please go through checkout to make a payment.');
      setTimeout(() => {
        navigate('/checkout', { replace: true });
      }, 1000);
    }
  }, []);

  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet' | 'paylater' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // UPI
  const [upiId, setUpiId] = useState('');

  // Net Banking
  const [selectedBank, setSelectedBank] = useState('');

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    console.log('=== HANDLE PAYMENT CALLED ===');
    console.log('Selected Method:', selectedMethod);
    console.log('Total:', total);
    console.log('Subtotal:', subtotal);
    console.log('Cart Items:', cartItems);
    console.log('Cart Items Length:', cartItems?.length);
    console.log('Cart Items Type:', typeof cartItems);
    console.log('Cart Items is Array:', Array.isArray(cartItems));

    // Validation based on method
    if (selectedMethod === 'upi' && !selectedOption && !upiId) {
      toast.error('Please select a UPI app or enter UPI ID');
      return;
    }

    if (selectedMethod === 'card') {
      if (!cardNumber || !cardName || !expiryDate || !cvv) {
        toast.error('Please fill all card details');
        return;
      }
      if (cardNumber.length < 16) {
        toast.error('Please enter a valid card number');
        return;
      }
    }

    if (selectedMethod === 'netbanking' && !selectedBank) {
      toast.error('Please select a bank');
      return;
    }

    if (selectedMethod === 'wallet' && !selectedOption) {
      toast.error('Please select a wallet');
      return;
    }

    if (selectedMethod === 'paylater' && !selectedOption) {
      toast.error('Please select a Pay Later option');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(async () => {
      try {
        setIsProcessing(false);
        
        // Save transaction to database for each cart item
        const userToken = localStorage.getItem('accessToken');
        const userData = localStorage.getItem('user');
        const user = userData ? JSON.parse(userData) : null;
        
        console.log('=== SAVING TRANSACTIONS ===');
        console.log('User from localStorage:', user);
        console.log('Access token:', userToken);
        console.log('Cart items to process:', cartItems);
        console.log('Cart items length:', cartItems?.length);
        console.log('Total amount:', total);
        
        if (!user) {
          console.error('No user found in localStorage');
          toast.error('User session not found. Please login again.');
          return;
        }
        
        // Check if cartItems exists and is an array
        if (!cartItems || !Array.isArray(cartItems)) {
          console.error('Cart items is not an array:', cartItems);
          toast.error('Invalid cart data. Please go back to checkout.');
          return;
        }
        
        if (cartItems.length === 0) {
          console.error('No cart items to process');
          console.log('Location state:', location.state);
          toast.error('No items to process. Please go back to checkout and try again.');
          return;
        }
        
        // Track success/failure
        let transactionsCreated = 0;
        let transactionsFailed = 0;
        
        // Create transactions for each massage in cart
        for (const item of cartItems) {
          try {
            const massageId = item.massageid || item.massage?.id;
            const itemAmount = item.massage?.price || 0;
            const city = item.massage?.massage_zone || 'Unknown';
            
            if (!massageId) {
              console.error('Missing massage ID for item:', item);
              transactionsFailed++;
              continue;
            }
            
            const transactionPayload = {
              customerId: parseInt(user.id),
              massageId: parseInt(massageId),
              couponCode: couponCode || null,
              amount: itemAmount,
              city: city
            };
            
            console.log('Creating transaction for item:', transactionPayload);
            
            const response = await fetch(
              `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/transaction/create`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${publicAnonKey}`
                },
                body: JSON.stringify(transactionPayload)
              }
            );
            
            const responseText = await response.text();
            console.log('Transaction API response status:', response.status);
            console.log('Transaction API response text:', responseText);
            
            let data;
            try {
              data = JSON.parse(responseText);
            } catch (parseError) {
              console.error('Failed to parse transaction response:', parseError);
              toast.error(`Failed to record transaction for ${item.massage?.massagename || 'item'}`);
              transactionsFailed++;
              continue;
            }
            
            if (!response.ok || !data.success) {
              console.error('Failed to create transaction:', data.error);
              toast.error(`Failed to record transaction: ${data.error}`);
              transactionsFailed++;
            } else {
              console.log('Transaction created successfully:', data.transaction);
              transactionsCreated++;
            }
          } catch (error) {
            console.error('Error creating transaction:', error);
            toast.error('Error recording transaction');
            transactionsFailed++;
          }
        }
        
        console.log(`Transactions: ${transactionsCreated} created, ${transactionsFailed} failed`);
        
        // Clear cart after successful payment
        console.log('=== CLEARING CART ===');
        try {
          const clearResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/cart/clear`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'X-User-Token': userToken || '',
                'Authorization': `Bearer ${publicAnonKey}`
              }
            }
          );
          
          const clearResponseText = await clearResponse.text();
          console.log('Cart clear API response status:', clearResponse.status);
          console.log('Cart clear API response text:', clearResponseText);
          
          let clearData;
          try {
            clearData = JSON.parse(clearResponseText);
          } catch (parseError) {
            console.error('Failed to parse cart clear response:', parseError);
            toast.warning('Payment successful but cart was not cleared');
            clearData = null;
          }
          
          if (clearResponse.ok && clearData?.success) {
            console.log('Cart cleared successfully. Items deleted:', clearData.itemsDeleted);
            toast.success(`Cart cleared! ${clearData.itemsDeleted} items removed`);
          } else {
            console.error('Failed to clear cart:', clearData);
            toast.warning('Payment successful but cart was not cleared');
          }
        } catch (error) {
          console.error('Error clearing cart:', error);
          toast.warning('Payment successful but cart was not cleared');
        }
        
        // Store payment information
        console.log('=== STORING PAYMENT INFORMATION ===');
        try {
          const paymentInfoPayload = {
            customerId: parseInt(user.id),
            paymentMethod: selectedMethod,
            amount: total,
            selectedOption: selectedOption,
            cardDetails: selectedMethod === 'card' ? cardNumber.replace(/\s/g, '') : null,
            upiDetails: selectedMethod === 'upi' ? upiId : null,
            bankName: selectedMethod === 'netbanking' ? selectedBank : null
          };
          
          console.log('Payment info payload:', paymentInfoPayload);
          
          const paymentInfoResponse = await fetch(
            `https://${projectId}.supabase.co/functions/v1/make-server-86f09702/payment/store-info`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${publicAnonKey}`
              },
              body: JSON.stringify(paymentInfoPayload)
            }
          );
          
          const paymentInfoResponseText = await paymentInfoResponse.text();
          console.log('Payment info API response status:', paymentInfoResponse.status);
          console.log('Payment info API response text:', paymentInfoResponseText);
          
          let paymentInfoData;
          try {
            paymentInfoData = JSON.parse(paymentInfoResponseText);
          } catch (parseError) {
            console.error('Failed to parse payment info response:', parseError);
            toast.warning('Payment successful but payment info was not stored');
            paymentInfoData = null;
          }
          
          if (paymentInfoResponse.ok && paymentInfoData?.success) {
            console.log('Payment information stored successfully:', paymentInfoData.paymentInfo);
            toast.success('Payment details saved successfully');
          } else {
            console.error('Failed to store payment info:', paymentInfoData);
            toast.warning('Payment successful but payment info was not stored');
          }
        } catch (error) {
          console.error('Error storing payment info:', error);
          toast.warning('Payment successful but payment info was not stored');
        }
        
        // Show final success message
        toast.success('Payment successful!');
        
        // Navigate to confirmation
        navigate('/confirmation', { state: { paymentMethod: selectedMethod, total, couponCode } });
      } catch (error) {
        console.error('Payment processing error:', error);
        setIsProcessing(false);
        toast.error('Payment processing failed');
      }
    }, 2000);
  };

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
                onClick={() => navigate('/checkout')}
                className="p-2 hover:bg-orange-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </motion.button>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent" style={{ fontFamily: 'var(--font-archive)' }}>
                SAVADHIKA PAYMENT
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">Secure Payment</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Amount Display */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center"
          >
            <p className="text-gray-600 text-sm mb-2">Amount to Pay</p>
            <p className="text-5xl font-bold text-orange-600">₹{total.toFixed(2)}</p>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 sm:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h2>

            {/* UPI */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedMethod(selectedMethod === 'upi' ? null : 'upi')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'upi' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Smartphone className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">UPI</p>
                    <p className="text-sm text-gray-500">Pay via UPI apps or UPI ID</p>
                  </div>
                </div>
                {selectedMethod === 'upi' && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </button>

              {selectedMethod === 'upi' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">Select UPI App</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {upiApps.map((app) => (
                      <motion.button
                        key={app.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedOption(app.id)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedOption === app.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : app.color
                        }`}
                      >
                        <div className="text-3xl mb-2">{app.icon}</div>
                        <p className="text-xs font-semibold text-gray-700">{app.name}</p>
                      </motion.button>
                    ))}
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-50 text-gray-500">OR</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter UPI ID
                    </label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Cards */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedMethod(selectedMethod === 'card' ? null : 'card')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'card' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Credit / Debit Card</p>
                    <p className="text-sm text-gray-500">Visa, Mastercard, RuPay, Amex</p>
                  </div>
                </div>
                {selectedMethod === 'card' && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </button>

              {selectedMethod === 'card' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl space-y-4"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                        setCardNumber(formatted);
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength={5}
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setExpiryDate(value);
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={3}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Net Banking */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedMethod(selectedMethod === 'netbanking' ? null : 'netbanking')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'netbanking' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Net Banking</p>
                    <p className="text-sm text-gray-500">All Indian banks supported</p>
                  </div>
                </div>
                {selectedMethod === 'netbanking' && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </button>

              {selectedMethod === 'netbanking' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl"
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Your Bank
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Choose a bank</option>
                    {banks.map((bank) => (
                      <option key={bank} value={bank}>{bank}</option>
                    ))}
                  </select>
                </motion.div>
              )}
            </div>

            {/* Wallets */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedMethod(selectedMethod === 'wallet' ? null : 'wallet')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'wallet' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Wallets</p>
                    <p className="text-sm text-gray-500">Paytm, PhonePe, Amazon Pay & more</p>
                  </div>
                </div>
                {selectedMethod === 'wallet' && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </button>

              {selectedMethod === 'wallet' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">Select Wallet</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wallets.map((wallet) => (
                      <motion.button
                        key={wallet.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedOption(wallet.id)}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          selectedOption === wallet.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <span className="text-2xl mr-2">{wallet.icon}</span>
                        <span className="font-semibold text-gray-700">{wallet.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Pay Later / EMI */}
            <div className="mb-6">
              <button
                onClick={() => setSelectedMethod(selectedMethod === 'paylater' ? null : 'paylater')}
                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                  selectedMethod === 'paylater' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-orange-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <div className="text-left">
                    <p className="font-bold text-gray-800">Pay Later / EMI</p>
                    <p className="text-sm text-gray-500">LazyPay, Simpl, ZestMoney</p>
                  </div>
                </div>
                {selectedMethod === 'paylater' && <CheckCircle2 className="w-6 h-6 text-orange-600" />}
              </button>

              {selectedMethod === 'paylater' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-4 bg-gray-50 rounded-xl"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-3">Select Option</p>
                  <div className="space-y-3">
                    {payLaterOptions.map((option) => (
                      <motion.button
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedOption(option.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          selectedOption === option.id 
                            ? 'border-orange-500 bg-orange-50' 
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{option.icon}</span>
                            <div>
                              <p className="font-semibold text-gray-800">{option.name}</p>
                              <p className="text-sm text-gray-500">{option.desc}</p>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Pay Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={isProcessing || !selectedMethod}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isProcessing ? (
                <>
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Pay ₹{total.toFixed(2)}
                </>
              )}
            </motion.button>

            <p className="text-xs text-center text-gray-500 mt-4">
              🔒 Your payment information is secure and encrypted
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
import { motion } from 'motion/react';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import blueLotusLogo from 'figma:asset/a35e5e2591b4780b92aa64729c88b63455161394.png';

export function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { paymentMethod = 'Unknown', total = 0, couponCode = '' } = location.state || {};

  useEffect(() => {
    // Confetti animation
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={blueLotusLogo} alt="Savadhika Logo" className="h-20 w-20" />
        </div>

        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-bold text-gray-800 mb-4"
          style={{ fontFamily: 'Averia Serif Libre, serif' }}
        >
          Booking Confirmed!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          Thank you for choosing SAVADHIKA. Your wellness journey awaits!
        </motion.p>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8"
        >
          <p className="text-gray-700 mb-2">
            A confirmation email has been sent to your registered email address.
          </p>
          <p className="text-sm text-gray-600">
            Our team will contact you shortly to confirm your appointment details.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/journey')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-orange-500 text-orange-500 font-bold rounded-xl hover:bg-orange-50 transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            View My Bookings
          </motion.button>
        </div>

        {/* Decorative Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <p className="text-sm text-gray-500">
            Need help? Contact us at <span className="text-orange-600 font-semibold">support@savadhika.com</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
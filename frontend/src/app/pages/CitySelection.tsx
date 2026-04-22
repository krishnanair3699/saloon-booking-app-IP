import { motion } from 'motion/react';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useBooking } from '../contexts/BookingContext';
import { DiscountScroller } from '../components/DiscountScroller';
import { LanguageSelector } from '../components/LanguageSelector';
import { cities } from '../data/services';
import mumbaiImage from 'figma:asset/ae0afacf99613e636b5b27a1284d1b080e288b6b.png';
import delhiImage from 'figma:asset/8b7624c7a992211fc633287cba43b2a90ce91ded.png';

export function CitySelection() {
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const cityImages: Record<string, string> = {
    mumbai: mumbaiImage,
    delhi: delhiImage,
  };

  const handleCitySelect = (cityId: string) => {
    updateBooking({ city: cityId });
    navigate('/body-area');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Discount Scroller */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <DiscountScroller />
      </div>

      {/* Header */}
      <header className="fixed top-12 left-0 right-0 z-50 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-orange-50 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-center mb-4 text-gray-800"
            style={{ fontFamily: 'Averia Serif Libre, serif' }}
          >
            Select Your City
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-600 mb-16 text-lg"
          >
            Choose your preferred location for the wellness experience
          </motion.p>

          {/* City Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {cities.map((city, index) => (
              <motion.button
                key={city.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -8 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCitySelect(city.id)}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{ 
                  boxShadow: '12px 12px 24px rgba(251, 191, 36, 0.15), -12px -12px 24px rgba(255, 255, 255, 0.9)'
                }}
              >
                {/* City Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={cityImages[city.id]}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* City Name Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <h2 
                        className="text-4xl font-bold text-white drop-shadow-lg"
                        style={{ fontFamily: 'Averia Serif Libre, serif' }}
                      >
                        {city.name}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Bottom Section */}
                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-semibold">Select Location</span>
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

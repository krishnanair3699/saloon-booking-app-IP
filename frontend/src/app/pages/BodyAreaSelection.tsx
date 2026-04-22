import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useBooking } from '../contexts/BookingContext';
import { DiscountScroller } from '../components/DiscountScroller';
import { LanguageSelector } from '../components/LanguageSelector';
import { bodyAreas } from '../data/services';

export function BodyAreaSelection() {
  const navigate = useNavigate();
  const { updateBooking } = useBooking();

  const handleBodyAreaSelect = (areaId: string) => {
    updateBooking({ bodyArea: areaId });
    navigate('/services');
  };

  const getBodyIcon = (icon: string) => {
    switch (icon) {
      case 'legs':
        return (
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M35 10 L35 45 L30 80 L35 95 M35 45 L38 80 L35 95" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M65 10 L65 45 L60 80 L65 95 M65 45 L68 80 L65 95" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <ellipse cx="35" cy="8" rx="5" ry="6" fill="currentColor"/>
            <ellipse cx="65" cy="8" rx="5" ry="6" fill="currentColor"/>
          </svg>
        );
      case 'body':
        return (
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M30 20 L30 70 L40 90 M70 20 L70 70 L60 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M30 20 L70 20 L70 70 L30 70 Z" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="currentColor" fillOpacity="0.2"/>
            <circle cx="50" cy="45" r="8" fill="currentColor" fillOpacity="0.3"/>
          </svg>
        );
      case 'arms':
        return (
          <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="20" r="12" fill="currentColor" fillOpacity="0.3"/>
            <path d="M50 32 L50 50" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M50 35 L20 55 L15 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <path d="M50 35 L80 55 L85 75" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            <circle cx="15" cy="75" r="4" fill="currentColor"/>
            <circle cx="85" cy="75" r="4" fill="currentColor"/>
          </svg>
        );
      default:
        return null;
    }
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
            onClick={() => navigate('/city')}
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
            Select Body Area
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center text-gray-600 mb-16 text-lg"
          >
            Choose the area you'd like to focus on
          </motion.p>

          {/* Body Area Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {bodyAreas.map((area, index) => (
              <motion.button
                key={area.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBodyAreaSelect(area.id)}
                className="group relative bg-gradient-to-br from-amber-100 to-orange-100 rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300"
                style={{ 
                  boxShadow: '10px 10px 20px rgba(251, 191, 36, 0.2), -10px -10px 20px rgba(255, 255, 255, 0.9)'
                }}
              >
                <div className="flex flex-col items-center gap-6">
                  {/* Icon */}
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center shadow-xl text-white group-hover:scale-110 transition-transform duration-300">
                    {getBodyIcon(area.icon)}
                  </div>
                  
                  {/* Title */}
                  <h3 
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: 'Averia Serif Libre, serif' }}
                  >
                    {area.name}
                  </h3>

                  {/* Arrow */}
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
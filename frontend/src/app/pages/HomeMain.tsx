import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';
import { LanguageSelector } from '../components/LanguageSelector';
import { DiscountScroller } from '../components/DiscountScroller';
import { BackgroundMusic } from '../components/BackgroundMusic';
import { AuthModal } from '../components/AuthModal';
import { Calendar, BookOpen, Info, Flower2, ScrollText, LogIn, Settings, User, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import logoIcon from 'figma:asset/f5c3621fa565fad4d1df57077290aa8f6e2d8469.png';
import buddhaImage from 'figma:asset/013962e38318c81e3634e4d5f54b30346648d0c0.png';
import pinkGradientBg from 'figma:asset/9627104c980246bdcb38d64e74baec6431d3e8cf.png';
import pinkLily from 'figma:asset/a98efbaf504622de7d251080eb82116829d676c8.png';
import bougainvillea from 'figma:asset/564a59705870cdade072bae1339958e0e164b157.png';
import cherryBlossom from 'figma:asset/534d5a66fa72509e25b8289bfa2305bf97ec4cbe.png';
import pinkLilies from 'figma:asset/e292cbc8a241374cef35185c77c53028eb68515c.png';

export function HomeMain() {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin, user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="h-screen relative overflow-hidden flex flex-col">
      {/* Pink gradient background */}
      <img 
        src={pinkGradientBg} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Decorative flowers positioned at edges with swaying animation */}
      {/* TOP LEFT - Pink Lily - Close/Large */}
      <motion.img 
        src={pinkLily} 
        alt="" 
        className="absolute -top-12 -left-8 w-72 h-72 object-contain pointer-events-none drop-shadow-xl"
        animate={{
          rotate: [0, 2, -1, 2, 0],
          x: [0, 4, -3, 4, 0],
          y: [0, 3, -2, 3, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
        style={{ transformOrigin: 'bottom center' }}
      />
      
      {/* TOP RIGHT - Bougainvillea - Medium */}
      <motion.img 
        src={bougainvillea} 
        alt="" 
        className="absolute -top-16 -right-12 w-64 h-64 object-contain pointer-events-none opacity-90 drop-shadow-lg blur-[0.3px]"
        animate={{
          rotate: [0, -2, 1, -2, 0],
          x: [0, -5, 3, -5, 0],
          y: [0, 4, -3, 4, 0],
        }}
        transition={{
          duration: 8.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
        style={{ transformOrigin: 'bottom center', transform: 'scaleX(-1)' }}
      />
      
      {/* TOP CENTER LEFT - Cherry Blossom - Far/Small */}
      <motion.img 
        src={cherryBlossom} 
        alt="" 
        className="absolute top-4 left-1/4 w-32 h-32 object-contain pointer-events-none opacity-60 blur-[0.5px]"
        animate={{
          rotate: [0, 3, -2, 3, 0],
          x: [0, 3, -2, 3, 0],
          y: [0, 2, -1, 2, 0],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
      />
      
      {/* TOP CENTER RIGHT - Pink Lilies - Far/Small */}
      <motion.img 
        src={pinkLilies} 
        alt="" 
        className="absolute top-8 right-1/4 w-40 h-40 object-contain pointer-events-none opacity-70 blur-[0.4px]"
        animate={{
          rotate: [0, -3, 2, -3, 0],
          x: [0, -4, 2, -4, 0],
          y: [0, 3, -2, 3, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
      />
      
      {/* BOTTOM LEFT - Pink Lilies - Close/Large */}
      <motion.img 
        src={pinkLilies} 
        alt="" 
        className="absolute -bottom-16 -left-12 w-80 h-80 object-contain pointer-events-none drop-shadow-2xl"
        animate={{
          rotate: [0, 3, -2, 3, 0],
          x: [0, 5, -4, 5, 0],
          y: [0, 4, -3, 4, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
        style={{ transformOrigin: 'top center' }}
      />
      
      {/* BOTTOM RIGHT - Cherry Blossom - Medium */}
      <motion.img 
        src={cherryBlossom} 
        alt="" 
        className="absolute -bottom-8 -right-8 w-56 h-56 object-contain pointer-events-none opacity-85 drop-shadow-lg blur-[0.3px]"
        animate={{
          rotate: [0, -3, 2, -3, 0],
          x: [0, -4, 3, -4, 0],
          y: [0, 3, -2, 3, 0],
        }}
        transition={{
          duration: 9.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
        style={{ transformOrigin: 'top center', transform: 'scaleX(-1)' }}
      />
      
      {/* LEFT MIDDLE - Bougainvillea - Far/Small */}
      <motion.img 
        src={bougainvillea} 
        alt="" 
        className="absolute top-1/2 -translate-y-1/2 -left-10 w-48 h-48 object-contain pointer-events-none opacity-65 blur-[0.4px]"
        animate={{
          rotate: [0, 2, -2, 2, 0],
          x: [0, 4, -3, 4, 0],
          y: [0, 3, -2, 3, 0],
        }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.15)' }}
      />
      
      {/* RIGHT MIDDLE - Pink Lily - Medium */}
      <motion.img 
        src={pinkLily} 
        alt="" 
        className="absolute top-1/2 -translate-y-1/2 -right-10 w-60 h-60 object-contain pointer-events-none opacity-80 drop-shadow-lg blur-[0.3px]"
        animate={{
          rotate: [0, -2, 2, -2, 0],
          x: [0, -4, 3, -4, 0],
          y: [0, 4, -3, 4, 0],
        }}
        transition={{
          duration: 10.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        whileHover={{ scale: 1.02, filter: 'brightness(1.1)' }}
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Background Music */}
      <BackgroundMusic />

      {/* Consolidated Header: Ticker with Hamburger Menu */}
      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Discount Scroller as Background */}
        <div className="relative">
          <DiscountScroller />
          
          {/* Overlaid Hamburger Menu Button */}
          <div className="absolute inset-0 flex items-center justify-end px-6">
            <motion.button
              onClick={() => setShowMenu(!showMenu)}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              animate={{ 
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
              }}
              className="relative p-2 rounded-lg"
              style={{
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.6))'
              }}
            >
              <Menu 
                className="w-7 h-7 text-white" 
                strokeWidth={2.5}
                style={{
                  filter: 'drop-shadow(0 0 6px rgba(255, 255, 255, 0.8))'
                }}
              />
            </motion.button>
          </div>

          {/* Dropdown Menu */}
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="absolute top-full right-0 mt-2 mr-6 bg-white/98 backdrop-blur-lg rounded-xl shadow-2xl border-2 border-purple-300 overflow-hidden z-50"
              style={{
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(147, 51, 234, 0.3)'
              }}
            >
              <div className="p-4 space-y-3 min-w-[240px]">
                {/* Language Selector */}
                <div className="pb-3 border-b-2 border-purple-200">
                  <p className="text-xs font-semibold text-gray-600 mb-2 px-2">Language</p>
                  <LanguageSelector />
                </div>

                {/* Auth Section */}
                <div className="pt-2 space-y-2">
                  {!isAuthenticated ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowAuthModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                    >
                      <LogIn className="w-5 h-5" />
                      <span>Sign In</span>
                    </motion.button>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg border-2 border-purple-300">
                        <User className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-800">{user?.name}</span>
                      </div>
                      
                      {isAdmin && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            navigate('/admin');
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Admin Panel</span>
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          signOut();
                          setShowMenu(false);
                        }}
                        className="w-full flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-lg hover:from-red-600 hover:to-red-700 transition-all shadow-md text-sm"
                      >
                        Sign Out
                      </motion.button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </header>

      {/* Main Content - Compressed to fit single screen */}
      <main className="relative pt-16 pb-12 px-6 z-10">
        <div className="max-w-7xl mx-auto">
          {/* Floating Lotus Logo at Top - Smaller */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0],
            }}
            transition={{ 
              opacity: { duration: 1 },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
            className="text-center mb-4"
          >
            <img 
              src={logoIcon} 
              alt="Savadhika Lotus" 
              className="w-24 h-auto mx-auto drop-shadow-lg"
            />
          </motion.div>

          {/* Floating Buddha in Center - Scaled down 15% and moved up */}
          <motion.div
            className="flex justify-center mb-1"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              opacity: 1,
              scale: 0.85,
              x: [0, 15, -15, 0],
              y: [0, -20, 20, 0],
            }}
            transition={{
              opacity: { duration: 1.5 },
              scale: { duration: 1.5 },
              x: {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              },
              y: {
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            }}
          >
            <img
              src={buddhaImage}
              alt="Buddha"
              className="w-[425px] h-[425px] object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Navigation Icons - Moved up to sit directly below Buddha */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto -mt-4"
          >
            {/* Booking - Deep Blue Lotus */}
            <motion.button
              onClick={() => navigate('/city')}
              whileHover={{ scale: 1.08, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-3 py-4 transition-all duration-300"
            >
              {/* Floating Deep Blue Lotus Icon with Glow */}
              <motion.div 
                className="relative"
                animate={{ 
                  y: [0, -6, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {/* Soft blue glow background */}
                <div className="absolute inset-0 blur-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, #3B82F6 0%, #1D4ED8 40%, transparent 70%)',
                    transform: 'scale(1.5)'
                  }}
                />
                
                {/* Glass morphism circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-100/40 to-blue-200/30 backdrop-blur-md"
                  style={{
                    boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
                  }}
                />
                
                {/* Lotus Icon */}
                <Flower2
                  className="relative w-14 h-14 text-blue-600 group-hover:text-blue-500 transition-colors duration-300"
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(59, 130, 246, 0.8))'
                  }}
                />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-700 transition-colors" 
                style={{ fontFamily: 'Averia Serif Libre, serif' }}>
                Booking
              </h3>
              <p className="text-xs text-gray-600 text-center">Book your wellness session</p>
            </motion.button>

            {/* Journey - Deep Purple Scroll */}
            <motion.button
              onClick={() => navigate('/journey')}
              whileHover={{ scale: 1.08, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-3 py-4 transition-all duration-300"
            >
              {/* Floating Deep Purple Scroll Icon with Glow */}
              <motion.div 
                className="relative"
                animate={{ 
                  y: [0, -6, 0],
                  rotate: [0, -2, 2, 0]
                }}
                transition={{ 
                  duration: 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.2
                }}
              >
                {/* Soft purple glow background */}
                <div className="absolute inset-0 blur-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, #8B5CF6 0%, #6D28D9 40%, transparent 70%)',
                    transform: 'scale(1.5)'
                  }}
                />
                
                {/* Glass morphism circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-100/40 to-purple-200/30 backdrop-blur-md"
                  style={{
                    boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
                  }}
                />
                
                {/* Scroll/Book Icon */}
                <ScrollText
                  className="relative w-14 h-14 text-purple-600 group-hover:text-purple-500 transition-colors duration-300"
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.8))'
                  }}
                />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors" 
                style={{ fontFamily: 'Averia Serif Libre, serif' }}>
                Journey
              </h3>
              <p className="text-xs text-gray-600 text-center">Discover our story</p>
            </motion.button>

            {/* Info - Teal Circle with 'i' */}
            <motion.button
              onClick={() => navigate('/info')}
              whileHover={{ scale: 1.08, y: -10 }}
              whileTap={{ scale: 0.95 }}
              className="group relative flex flex-col items-center gap-3 py-4 transition-all duration-300"
            >
              {/* Floating Teal Info Icon with Glow */}
              <motion.div 
                className="relative"
                animate={{ 
                  y: [0, -6, 0],
                  rotate: [0, 2, -2, 0]
                }}
                transition={{ 
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.4
                }}
              >
                {/* Soft teal glow background */}
                <div className="absolute inset-0 blur-2xl opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, #14B8A6 0%, #0D9488 40%, transparent 70%)',
                    transform: 'scale(1.5)'
                  }}
                />
                
                {/* Glass morphism circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal-100/40 to-teal-200/30 backdrop-blur-md"
                  style={{
                    boxShadow: '0 8px 32px rgba(20, 184, 166, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
                  }}
                />
                
                {/* Info Icon - Thin Circle Style */}
                <Info
                  className="relative w-14 h-14 text-teal-600 group-hover:text-teal-500 transition-colors duration-300"
                  strokeWidth={2}
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(20, 184, 166, 0.8))'
                  }}
                />
              </motion.div>
              
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors" 
                style={{ fontFamily: 'Averia Serif Libre, serif' }}>
                Info
              </h3>
              <p className="text-xs text-gray-600 text-center">Contact & support</p>
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}
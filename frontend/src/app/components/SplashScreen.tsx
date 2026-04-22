import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import logoImage from 'figma:asset/15e8271eb901fd6d7460f912e393ed51bd0d3c24.png';
import pinkGradientBg from 'figma:asset/9627104c980246bdcb38d64e74baec6431d3e8cf.png';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [showLogo, setShowLogo] = useState(true);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Show logo for 1.5 seconds, then fade out
    const logoTimer = setTimeout(() => {
      setShowLogo(false);
    }, 1500);

    // Show text after logo starts disappearing
    const textTimer = setTimeout(() => {
      setShowText(true);
    }, 2000);

    // Complete splash screen after text shows for 1.5 seconds
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 4000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
    >
      {/* Pink gradient background matching main page */}
      <img 
        src={pinkGradientBg} 
        alt="" 
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Radial glow effect */}
      <div className="absolute inset-0 bg-gradient-radial from-white/20 via-transparent to-transparent" />
      
      <div className="flex flex-col items-center gap-12 relative z-10">
        {/* Logo - emerges with rotation and glow */}
        <AnimatePresence>
          {showLogo && (
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
              }}
              exit={{ opacity: 0, scale: 1.2, y: -50 }}
              transition={{ 
                initial: { duration: 1.2, ease: 'easeOut' },
                exit: { duration: 0.8 }
              }}
            >
              {/* Glow behind logo */}
              <motion.div
                className="absolute inset-0 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6) 0%, transparent 70%)',
                  transform: 'scale(2)',
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <motion.img
                src={logoImage}
                alt="Logo"
                className="w-48 h-48 relative z-10"
                style={{ filter: 'drop-shadow(0 0 30px rgba(59, 130, 246, 0.5))' }}
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SAVADHIKA Text - appears with elegant animation */}
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="text-center"
            >
              <motion.h1 
                className="text-7xl md:text-8xl tracking-wider drop-shadow-2xl" 
                style={{ 
                  fontFamily: 'Pacifico, cursive',
                  color: '#3b82f6', // Blue color
                }}
                animate={{
                  scale: [1, 1.02, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                Savadhika
              </motion.h1>
              
              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="mt-4 text-xl md:text-2xl text-gray-600 tracking-wide"
                style={{ fontFamily: 'Averia Serif Libre, serif' }}
              >
                Your Wellness Sanctuary
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
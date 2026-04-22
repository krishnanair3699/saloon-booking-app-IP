import { useState, useEffect } from 'react';
import { SplashScreen } from '../components/SplashScreen';
import { HomeMain } from './HomeMain';
import { AnimatePresence } from 'motion/react';

export function Home() {
  const [showSplash, setShowSplash] = useState(true); // Always show splash on load

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        ) : (
          <HomeMain key="main" />
        )}
      </AnimatePresence>
    </>
  );
}
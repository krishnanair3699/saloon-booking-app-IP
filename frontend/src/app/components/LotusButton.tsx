import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

interface LotusButtonProps {
  serviceId: string;
  label: string;
  price: number;
  duration: number;
  className?: string;
}

export function LotusButton({ serviceId, label, price, duration, className }: LotusButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  const petalScale = isAnimating ? 1.5 : 1;

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      navigate(`/booking?service=${serviceId}`);
    }, 1000);
  };

  return (
    <button
      onClick={handleClick}
      className={`group relative ${className}`}
      disabled={isAnimating}
    >
      <motion.div
        className="relative w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-pink-100 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 border-purple-200 hover:border-purple-300"
        whileHover={{ scale: 1.03, y: -5 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-200/50 via-purple-200/50 to-pink-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        />
        
        <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full min-h-[320px]">
          <div className="mb-6 relative">
            <motion.svg
              width="120"
              height="120"
              viewBox="0 0 100 100"
              className="filter drop-shadow-lg"
              animate={isAnimating ? {
                scale: [1, 1.3, 0],
                rotate: [0, 180, 360],
              } : {}}
              transition={{
                duration: 1,
                ease: 'easeInOut',
              }}
            >
              {/* Lotus petals */}
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i * 45 * Math.PI) / 180;
                const x = 50 + Math.cos(angle) * 30 * petalScale;
                const y = 50 + Math.sin(angle) * 30 * petalScale;

                return (
                  <motion.ellipse
                    key={i}
                    cx={x}
                    cy={y}
                    rx={15 * petalScale}
                    ry={8 * petalScale}
                    fill="url(#gradient)"
                    opacity={0.9}
                    style={{
                      transformOrigin: '50px 50px',
                    }}
                    animate={{
                      rotate: i * 45,
                    }}
                  />
                );
              })}

              {/* Center of lotus */}
              <circle cx="50" cy="50" r={12 * petalScale} fill="url(#centerGradient)" opacity="0.95" />
              
              {/* Gradient definitions */}
              <defs>
                <radialGradient id="gradient">
                  <stop offset="0%" stopColor="#f9a8d4" />
                  <stop offset="100%" stopColor="#c084fc" />
                </radialGradient>
                <radialGradient id="centerGradient">
                  <stop offset="0%" stopColor="#fde047" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </radialGradient>
              </defs>
            </motion.svg>
            
            {/* Glow effect behind lotus */}
            <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-300 blur-2xl opacity-40 -z-10" />
          </div>

          <h3 className="text-2xl font-bold text-gray-800 text-center mb-3" style={{ fontFamily: 'var(--font-archive)' }}>
            {label}
          </h3>
          
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="text-sm text-gray-600">{duration} minutes</div>
            <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              ₹{price}
            </div>
          </div>
          
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />
          
          <motion.div
            className="mt-4 text-purple-600 font-semibold text-sm tracking-wide"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            TAP TO SELECT
          </motion.div>
        </div>
      </motion.div>
    </button>
  );
}
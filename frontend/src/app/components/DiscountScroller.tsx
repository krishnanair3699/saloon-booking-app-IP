import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'sonner';

export function DiscountScroller() {
  const { t } = useLanguage();
  
  const message = `15% OFF for New Members – Use Code NEWMASSAGE15`;
  
  const handleClick = async () => {
    const code = 'NEWMASSAGE15';
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code);
        toast.success('Code NEWMASSAGE15 copied to clipboard!');
      } else {
        // Fallback method for browsers that don't support clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          document.execCommand('copy');
          toast.success('Code NEWMASSAGE15 copied to clipboard!');
        } catch (err) {
          toast.info('Code: NEWMASSAGE15 (Unable to copy automatically)');
        }
        
        document.body.removeChild(textArea);
      }
    } catch (err) {
      // If clipboard fails, just show the code
      toast.info('Code: NEWMASSAGE15 (Click to try again)');
    }
  };
  
  return (
    <div 
      className="w-full bg-black py-3 overflow-hidden cursor-pointer"
      onClick={handleClick}
      title="Click to copy code"
    >
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center text-yellow-300 mx-8">
            <span className="text-lg font-bold tracking-wide" style={{ textShadow: '0 0 10px rgba(253, 224, 71, 0.5)' }}>
              ✨ {message} ✨
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
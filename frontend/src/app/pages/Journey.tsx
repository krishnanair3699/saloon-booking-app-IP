import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DiscountScroller } from '../components/DiscountScroller';
import { LanguageSelector } from '../components/LanguageSelector';

export function Journey() {
  const navigate = useNavigate();

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
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Averia Serif Libre, serif' }}
          >
            Our Journey
          </motion.h1>

          {/* Thai Massage History Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-16 bg-white/80 rounded-3xl p-10 shadow-lg"
          >
            <h2 className="text-4xl font-bold mb-6 text-orange-800" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
              History of Thai Massage
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Thai massage, also known as "Nuad Thai" or "Thai Yoga Massage," has been practiced for over 2,500 years. 
              It originated in India and was brought to Thailand by Buddhist monks, who used it as a healing art form 
              to maintain physical and spiritual well-being.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              This ancient practice combines acupressure, Indian Ayurvedic principles, and assisted yoga postures. 
              It works on energy lines throughout the body to restore balance and promote deep relaxation.
            </p>
          </motion.section>

          {/* Thailand Culture Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16 bg-white/80 rounded-3xl p-10 shadow-lg"
          >
            <h2 className="text-4xl font-bold mb-6 text-orange-800" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
              Cultural Background of Thailand
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              Thailand, known as the "Land of Smiles," has a rich cultural heritage deeply rooted in Buddhism. 
              The country's wellness traditions emphasize harmony between body, mind, and spirit.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Thai massage is considered a sacred healing art and is traditionally performed in temples. 
              It reflects the Thai philosophy of "metta" (loving-kindness) and is meant to be a meditative 
              practice for both the practitioner and the recipient.
            </p>
          </motion.section>

          {/* Brand Story Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-10 shadow-xl"
          >
            <h2 className="text-4xl font-bold mb-8 text-orange-900" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
              The Savadhika Story
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-3 text-orange-800">Origin in Thailand</h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Savadhika was founded by master therapists trained in traditional Thai massage techniques 
                  at the renowned Wat Pho temple in Bangkok. Our journey began with a simple mission: to share 
                  the authentic healing power of Thai wellness traditions with the world.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-orange-800">Expansion to India</h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  Recognizing the growing wellness consciousness in India, we brought our authentic Thai massage 
                  expertise to Mumbai and Delhi. We've created sanctuaries where ancient Thai healing meets 
                  modern luxury, offering urban Indians a refuge from their busy lives.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-semibold mb-3 text-orange-800">Philosophy & Techniques</h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  At Savadhika, we believe in holistic wellness. Our therapists are certified in traditional 
                  Thai massage techniques including Sen energy line work, deep tissue therapy, and yoga-based 
                  stretching. We use only organic oils and natural products, honoring the ancient traditions 
                  while ensuring the highest standards of hygiene and comfort.
                </p>
                <p className="text-lg text-gray-800 leading-relaxed mt-4">
                  Every session at Savadhika is more than a massage—it's a journey toward inner peace, 
                  physical renewal, and spiritual balance.
                </p>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

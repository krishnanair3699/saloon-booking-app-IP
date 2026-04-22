import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router';
import { DiscountScroller } from '../components/DiscountScroller';
import { LanguageSelector } from '../components/LanguageSelector';
import { toast } from 'sonner';

export function Info() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    issue: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Your query has been submitted. We will get back to you soon!');
    setFormData({ name: '', email: '', phone: '', issue: '' });
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
        <div className="max-w-6xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-bold text-center mb-16 text-gray-800"
            style={{ fontFamily: 'Averia Serif Libre, serif' }}
          >
            Contact & Support
          </motion.h1>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {/* Mumbai Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white/80 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-6 text-orange-800" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
                Mumbai
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-800 font-semibold">Address</p>
                    <p className="text-gray-600">
                      123 Wellness Avenue, Bandra West<br />
                      Mumbai, Maharashtra 400050
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-800 font-semibold">Phone Numbers</p>
                    <p className="text-gray-600">+91 22 1234 5678</p>
                    <p className="text-gray-600">+91 22 8765 4321</p>
                    <p className="text-gray-600">+91 98765 43210</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-800 font-semibold">Email</p>
                    <p className="text-gray-600">mumbai@savadhika.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Delhi Location */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/80 rounded-3xl p-8 shadow-lg"
            >
              <h2 className="text-3xl font-bold mb-6 text-orange-800" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
                Delhi
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-800 font-semibold">Address</p>
                    <p className="text-gray-600">
                      456 Serenity Plaza, Connaught Place<br />
                      New Delhi, Delhi 110001
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-800 font-semibold">Phone Numbers</p>
                    <p className="text-gray-600">+91 11 1234 5678</p>
                    <p className="text-gray-600">+91 11 8765 4321</p>
                    <p className="text-gray-600">+91 99999 12345</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <p className="text-gray-800 font-semibold">Email</p>
                    <p className="text-gray-600">delhi@savadhika.com</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Query Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-gradient-to-br from-orange-100 to-red-100 rounded-3xl p-10 shadow-xl max-w-2xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-6 text-center text-orange-900" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
              Send Us Your Query
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-800 font-semibold mb-2">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none bg-white/80"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none bg-white/80"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">Phone</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none bg-white/80"
                  placeholder="+91 12345 67890"
                />
              </div>

              <div>
                <label className="block text-gray-800 font-semibold mb-2">Your Issue/Query</label>
                <textarea
                  required
                  value={formData.issue}
                  onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none bg-white/80 resize-none"
                  placeholder="Please describe your query or issue..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Submit Query
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

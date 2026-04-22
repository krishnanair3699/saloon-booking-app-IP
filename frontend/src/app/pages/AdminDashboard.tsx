import { 
  LayoutDashboard, 
  LogOut, 
  Sparkles,
  Heart,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import TherapyMassageMaster from '../components/admin/TherapyMassageMaster';
import MISReport from '../components/admin/MISReport';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { user, signOut, isAdmin } = useAuth();
  const [activeView, setActiveView] = useState<'dashboard' | 'therapy' | 'mis'>('dashboard');

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  // Don't render anything if not admin
  if (!isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'therapy' as const, label: 'Therapy Massage Master', icon: Sparkles },
    { id: 'mis' as const, label: 'MIS Report', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Sparkles className="w-8 h-8 text-blue-600" />
              <div>
                <h1 
                  className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-orange-500"
                  style={{ fontFamily: 'Archivo Black, sans-serif' }}
                >
                  SAVADHIKA
                </h1>
                <p className="text-xs text-gray-600 font-medium">Admin Toolkit</p>
              </div>
            </div>

            {/* Desktop: User Info & Logout */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-bold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:p-10">
        {activeView === 'dashboard' ? (
          <div className="max-w-4xl mx-auto">
            <h2 
              className="text-4xl font-bold mb-4 text-gray-800"
              style={{ fontFamily: 'Archivo Black, sans-serif' }}
            >
              Welcome, Administrator
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Manage your spa and salon services from this central hub.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dashboard Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
              >
                <LayoutDashboard className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Dashboard</h3>
                <p className="text-blue-100">Overview of all admin operations</p>
              </motion.div>

              {/* Therapy Massage Master Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveView('therapy')}
                className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer"
              >
                <Heart className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">Therapy Massage Master</h3>
                <p className="text-purple-100">Manage therapeutic massage treatments</p>
                <button className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                  Open
                </button>
              </motion.div>

              {/* MIS Report Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveView('mis')}
                className="bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl cursor-pointer"
              >
                <BarChart3 className="w-12 h-12 mb-4 opacity-80" />
                <h3 className="text-2xl font-bold mb-2">MIS Report</h3>
                <p className="text-green-100">Generate and view management information system reports</p>
                <button className="mt-4 px-6 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Open
                </button>
              </motion.div>
            </div>
          </div>
        ) : (
          <div>
            <button
              onClick={() => setActiveView('dashboard')}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              ← Back to Dashboard
            </button>
            {activeView === 'therapy' ? <TherapyMassageMaster /> : <MISReport />}
          </div>
        )}
      </main>
    </div>
  );
}
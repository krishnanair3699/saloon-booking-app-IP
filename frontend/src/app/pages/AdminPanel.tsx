import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { projectId } from '/utils/supabase/info';
import { MASSAGE_TYPES, getMassageNamesByType } from '../config/massageData';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-86f09702`;

interface Massage {
  id: string;
  name: string;
  massage_type: string;
  body_area: string;
  price: number;
  duration: string;
  massage_zone: string;
  description: string;
  created_at?: string;
}

export function AdminPanel() {
  const navigate = useNavigate();
  const { isAdmin, accessToken, signOut } = useAuth();
  const [massages, setMassages] = useState<Massage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Massage>>({
    name: '',
    massage_type: '',
    body_area: 'lower',
    price: 0,
    duration: '',
    massage_zone: '',
    description: ''
  });

  useEffect(() => {
    if (!isAdmin) {
      toast.error('Admin access required');
      navigate('/');
      return;
    }
    fetchMassages();
  }, [isAdmin]);

  const fetchMassages = async () => {
    // Temporarily disabled - massage_master table not configured
    // Will be replaced with therapy_massage_master table
    setMassages([]);
    setIsLoading(false);
  };

  const handleAddMassage = async () => {
    if (!formData.name || !formData.duration || !formData.massage_zone || !formData.description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/massages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Massage added successfully!');
        setShowAddForm(false);
        setFormData({
          name: '',
          massage_type: '',
          body_area: 'lower',
          price: 0,
          duration: '',
          massage_zone: '',
          description: ''
        });
        await fetchMassages();
      } else {
        toast.error(data.error || 'Failed to add massage');
      }
    } catch (error) {
      console.error('Failed to add massage:', error);
      toast.error('Failed to add massage');
    }
  };

  const handleUpdateMassage = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/massages/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Massage updated successfully!');
        setEditingId(null);
        setFormData({
          name: '',
          massage_type: '',
          body_area: 'lower',
          price: 0,
          duration: '',
          massage_zone: '',
          description: ''
        });
        await fetchMassages();
      } else {
        toast.error(data.error || 'Failed to update massage');
      }
    } catch (error) {
      console.error('Failed to update massage:', error);
      toast.error('Failed to update massage');
    }
  };

  const handleDeleteMassage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this massage?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/admin/massages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (response.ok) {
        toast.success('Massage deleted successfully!');
        await fetchMassages();
      } else {
        toast.error('Failed to delete massage');
      }
    } catch (error) {
      console.error('Failed to delete massage:', error);
      toast.error('Failed to delete massage');
    }
  };

  const startEdit = (massage: Massage) => {
    setEditingId(massage.id);
    setFormData(massage);
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({
      name: '',
      massage_type: '',
      body_area: 'lower',
      price: 0,
      duration: '',
      massage_zone: '',
      description: ''
    });
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: 'Averia Serif Libre, serif' }}>
              Admin Panel - Massage Management
            </h1>
          </div>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Add Button */}
        <div className="mb-8 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setShowAddForm(!showAddForm);
              setEditingId(null);
              setFormData({
                name: '',
                massage_type: '',
                body_area: 'lower',
                price: 0,
                duration: '',
                massage_zone: '',
                description: ''
              });
            }}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg"
          >
            {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showAddForm ? 'Cancel' : 'Add New Massage'}
          </motion.button>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 shadow-xl mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingId ? 'Edit Massage' : 'Add New Massage'}
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Massage Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Massage Type *
                </label>
                <select
                  value={formData.massage_type}
                  onChange={(e) => setFormData({ ...formData, massage_type: e.target.value, name: '' })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select Massage Type</option>
                  {MASSAGE_TYPES.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              {/* Massage Name Dropdown - appears after type is selected */}
              {formData.massage_type && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Massage Name (Select or Enter Custom) *
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  >
                    <option value="">Select or type custom name below</option>
                    {getMassageNamesByType(formData.massage_type).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                  {/* Custom name input */}
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none mt-3"
                    placeholder="Or type custom massage name"
                  />
                </div>
              )}

              {/* Body Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Body Area *
                </label>
                <select
                  value={formData.body_area}
                  onChange={(e) => setFormData({ ...formData, body_area: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="lower">Lower Body</option>
                  <option value="torso">Torso</option>
                  <option value="upper">Upper Body</option>
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 1200"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration *
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., 60 min"
                />
              </div>

              {/* Massage Zone */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Massage Zone *
                </label>
                <input
                  type="text"
                  value={formData.massage_zone}
                  onChange={(e) => setFormData({ ...formData, massage_zone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  placeholder="e.g., Legs, Feet"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe the massage service..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => editingId ? handleUpdateMassage(editingId) : handleAddMassage()}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
              >
                <Save className="w-5 h-5" />
                {editingId ? 'Update Massage' : 'Add Massage'}
              </motion.button>
              
              {editingId && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all"
                >
                  Cancel
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Massages List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">All Massages</h2>
          
          {isLoading ? (
            <p className="text-gray-500">Loading massages...</p>
          ) : (
            <div className="grid gap-6">
              {['lower', 'torso', 'upper'].map(bodyArea => {
                const bodyMassages = massages.filter(m => m.body_area === bodyArea);
                if (bodyMassages.length === 0) return null;

                return (
                  <div key={bodyArea}>
                    <h3 className="text-xl font-bold text-gray-700 mb-4 capitalize">
                      {bodyArea === 'lower' ? 'Lower Body' : bodyArea === 'torso' ? 'Torso' : 'Upper Body'}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {bodyMassages.map((massage) => (
                        <motion.div
                          key={massage.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-800 mb-1">{massage.name}</h4>
                              {massage.massage_type && (
                                <p className="text-xs text-orange-600 font-semibold mb-2 uppercase">
                                  {MASSAGE_TYPES.find(t => t.value === massage.massage_type)?.label || massage.massage_type}
                                </p>
                              )}
                              <p className="text-sm text-gray-600 mb-2">{massage.description}</p>
                              <div className="flex flex-wrap gap-3 text-sm">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                                  ₹{massage.price}
                                </span>
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                                  {massage.duration}
                                </span>
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                                  {massage.massage_zone}
                                </span>
                              </div>
                            </div>
                            <div className="flex gap-2 ml-4">
                              <button
                                onClick={() => startEdit(massage)}
                                className="p-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition-colors"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteMassage(massage.id)}
                                className="p-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
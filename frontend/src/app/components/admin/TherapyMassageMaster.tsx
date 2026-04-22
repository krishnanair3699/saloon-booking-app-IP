import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit2, Trash2, Save, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { projectId, publicAnonKey } from '/utils/supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-86f09702`;

interface TherapyMassage {
  id: string;
  massagename: string;
  massagetype: string;
  duration: number;
  price: number;
  massagezone: string;
  description: string;
}

const MASSAGE_TYPES = ['Torso', 'Upper Body', 'Lower Back'];

export default function TherapyMassageMaster() {
  const { accessToken } = useAuth();
  const [massages, setMassages] = useState<TherapyMassage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    massageName: '',
    massageType: '',
    duration: 0,
    price: 0,
    massageZone: '',
    description: ''
  });

  // Fetch massages on component mount
  useEffect(() => {
    fetchMassages();
  }, []);

  const fetchMassages = async () => {
    try {
      setIsLoading(true);
      
      // Public endpoint but requires Authorization header for Supabase Edge Functions
      const response = await fetch(`${API_BASE}/massages`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      console.log('Massages response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Massages endpoint returned', response.status, 'Error:', errorText);
        setMassages([]);
        return;
      }

      const data = await response.json();
      console.log('Fetched massages:', data);
      console.log('First massage (if exists):', data.massages?.[0]);
      console.log('First massage keys:', data.massages?.[0] ? Object.keys(data.massages[0]) : 'No massages');
      setMassages(data.massages || []);
    } catch (error: any) {
      console.error('Fetch massages error:', error);
      setMassages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      massageName: '',
      massageType: '',
      duration: 0,
      price: 0,
      massageZone: '',
      description: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log('=== FORM SUBMIT STARTED ===');
    console.log('Form data:', formData);
    console.log('Editing ID:', editingId);
    console.log('Access token:', accessToken);
    console.log('Public anon key:', publicAnonKey);
    console.log('API Base:', API_BASE);

    if (!formData.massageName || !formData.massageType || !formData.duration || !formData.price || !formData.massageZone || !formData.description) {
      console.error('Validation failed - missing fields:', {
        massageName: !formData.massageName,
        massageType: !formData.massageType,
        duration: !formData.duration,
        price: !formData.price,
        massageZone: !formData.massageZone,
        description: !formData.description
      });
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare data for API (match backend field names)
      const payload = {
        massagename: formData.massageName,
        massagetype: formData.massageType,
        duration: Number(formData.duration),
        price: Number(formData.price),
        massagezone: formData.massageZone,
        Description: formData.description
      };

      const url = editingId 
        ? `${API_BASE}/admin/massages/${editingId}`
        : `${API_BASE}/admin/massages`;
      
      const method = editingId ? 'PUT' : 'POST';

      console.log('=== ABOUT TO FETCH ===');
      console.log('URL:', url);
      console.log('Method:', method);
      console.log('Payload:', payload);
      console.log('Admin Key (X-Admin-Key):', accessToken);
      console.log('Public Anon Key (Authorization):', publicAnonKey);
      console.log('Authorization header value:', `Bearer ${publicAnonKey}`);

      let response;
      try {
        const fetchOptions = {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
            'X-Admin-Key': accessToken || ''
          },
          body: JSON.stringify(payload)
        };
        
        console.log('Fetch options:', fetchOptions);
        console.log('Headers being sent:', fetchOptions.headers);
        
        response = await fetch(url, fetchOptions);
        console.log('=== FETCH COMPLETED ===');
        console.log('Response received:', response);
      } catch (fetchError: any) {
        console.error('=== FETCH ERROR ===');
        console.error('Fetch failed:', fetchError);
        console.error('Error name:', fetchError.name);
        console.error('Error message:', fetchError.message);
        console.error('Error stack:', fetchError.stack);
        throw new Error(`Network error: ${fetchError.message}`);
      }

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response statusText:', response.statusText);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get response text first, then try to parse as JSON
      let responseText;
      try {
        responseText = await response.text();
        console.log('Response text received:', responseText);
        console.log('Response text length:', responseText.length);
      } catch (textError: any) {
        console.error('Failed to read response text:', textError);
        throw new Error(`Failed to read server response: ${textError.message}`);
      }
      
      let result;
      try {
        result = JSON.parse(responseText);
        console.log('Parsed response data:', result);
      } catch (parseError: any) {
        console.error('Failed to parse response as JSON:', parseError);
        console.error('Raw response:', responseText);
        throw new Error(`Server returned invalid JSON (status ${response.status}): ${responseText.substring(0, 200)}`);
      }

      if (!response.ok) {
        const errorMsg = result.error || result.message || 'Failed to save therapy massage';
        console.error('=== SERVER ERROR ===');
        console.error('Status:', response.status);
        console.error('Error message:', errorMsg);
        console.error('Full response:', result);
        throw new Error(errorMsg);
      }

      console.log('=== SUCCESS ===');
      toast.success(editingId ? 'Therapy massage updated successfully!' : 'Therapy massage created successfully!');
      resetForm();
      fetchMassages();
    } catch (error: any) {
      console.error('=== CATCH BLOCK ===');
      console.error('Error caught:', error);
      console.error('Error type:', typeof error);
      console.error('Error name:', error?.name);
      console.error('Error message:', error?.message);
      console.error('Error stack:', error?.stack);
      console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
      
      toast.error(error.message || 'Failed to save therapy massage');
    } finally {
      setIsLoading(false);
      console.log('=== SUBMIT COMPLETED ===');
    }
  };

  const handleEdit = (massage: TherapyMassage) => {
    setFormData({
      massageName: massage.massagename,
      massageType: massage.massagetype,
      duration: massage.duration,
      price: massage.price,
      massageZone: massage.massagezone,
      description: massage.description || (massage as any).Description || ''
    });
    setEditingId(massage.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this therapy massage?')) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/admin/massages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'X-Admin-Key': accessToken || ''
        }
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Failed to delete therapy massage');
      }

      toast.success('Therapy massage deleted successfully!');
      fetchMassages();
    } catch (error: any) {
      console.error('Delete therapy massage error:', error);
      toast.error(error.message || 'Failed to delete therapy massage');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cream-50 to-blue-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-10 h-10 text-blue-600" />
              <h1 className="text-4xl font-black text-blue-900" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                THERAPY MASSAGE MASTER
              </h1>
            </div>
            <p className="text-gray-600 ml-13">Create and manage therapeutic massage treatments</p>
          </div>
          
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transform hover:-translate-y-1 transition-all"
            >
              <Plus className="w-5 h-5" />
              Add New Therapy
            </button>
          )}
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-4 border-blue-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-blue-900" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
                {editingId ? 'EDIT THERAPY MASSAGE' : 'ADD NEW THERAPY MASSAGE'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Massage Name */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                  1. Massage Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.massageName}
                  onChange={(e) => setFormData({ ...formData, massageName: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  placeholder="e.g., Deep Tissue Back Therapy"
                  required
                />
              </div>

              {/* Massage Type - Dropdown */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                  2. Massage Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.massageType}
                  onChange={(e) => setFormData({ ...formData, massageType: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg bg-white"
                  required
                >
                  <option value="">-- Select Body Area --</option>
                  {MASSAGE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                  3. Duration (minutes) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  placeholder="e.g., 60"
                  min="0"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                  4. Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  placeholder="e.g., 2500"
                  min="0"
                  required
                />
              </div>

              {/* Massage Zone */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                  5. Massage Zone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.massageZone}
                  onChange={(e) => setFormData({ ...formData, massageZone: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg"
                  placeholder="e.g., Upper Back, Shoulders, Neck"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-black text-gray-700 mb-2 uppercase">
                  6. Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border-3 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none text-lg resize-none"
                  placeholder="Describe the therapeutic massage treatment, benefits, and techniques..."
                  rows={4}
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-black text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Save className="w-5 h-5" />
                  {isLoading ? 'SAVING...' : (editingId ? 'UPDATE THERAPY' : 'ADD THERAPY')}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="px-6 py-4 border-3 border-gray-300 text-gray-700 rounded-xl font-black text-lg hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Massages List */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-4 border-blue-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
            <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'Archivo Black, sans-serif' }}>
              ALL THERAPY MASSAGES ({massages.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">Loading therapy massages...</p>
            </div>
          ) : massages.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">No therapy massages found. Add your first one!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Massage Name</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Zone</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-4 text-center text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {massages.map((massage) => (
                    <tr key={massage.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">{massage.massagename}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full ${
                          massage.massagetype === 'Torso' ? 'bg-purple-100 text-purple-800' :
                          massage.massagetype === 'Upper Body' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {massage.massagetype}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{massage.duration} min</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-green-600">₹{massage.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{massage.massagezone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">{massage.description || (massage as any).Description || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleEdit(massage)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(massage.id)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
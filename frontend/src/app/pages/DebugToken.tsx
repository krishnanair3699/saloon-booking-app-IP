import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';

export function DebugToken() {
  const { accessToken, user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const clearAndRelogin = () => {
    localStorage.clear();
    window.location.href = '/auth';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <button
        onClick={() => navigate('/services')}
        className="mb-6 p-2 hover:bg-pink-50 rounded-full transition-colors inline-flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600" />
        <span>Back to Services</span>
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Token Debug Information</h1>

        <div className="space-y-6">
          {/* Authentication Status */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Authentication Status</h2>
            <p className="text-gray-600">
              <strong>Is Authenticated:</strong> {isAuthenticated ? 'Yes' : 'No'}
            </p>
          </div>

          {/* User Info */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">User Information</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>

          {/* Access Token */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">Access Token</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Type:</strong> {typeof accessToken}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Length:</strong> {accessToken?.length || 0}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Starts with "user-":</strong> {accessToken?.startsWith('user-') ? 'Yes' : 'No'}
              </p>
              <p className="text-sm text-gray-600">
                <strong>First 30 chars:</strong> {accessToken?.substring(0, 30)}
              </p>
              <p className="text-sm text-gray-600 break-all">
                <strong>Full token:</strong>
              </p>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
                {accessToken || 'No token'}
              </pre>
            </div>
          </div>

          {/* LocalStorage */}
          <div className="border-b pb-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">LocalStorage</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-xs">
              {JSON.stringify({
                accessToken: localStorage.getItem('accessToken'),
                user: localStorage.getItem('user')
              }, null, 2)}
            </pre>
          </div>

          {/* Actions */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Actions</h2>
            <button
              onClick={clearAndRelogin}
              className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Storage & Re-login
            </button>
            <p className="text-sm text-gray-500 mt-2">
              This will clear all local storage and redirect you to the login page to get a fresh token.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

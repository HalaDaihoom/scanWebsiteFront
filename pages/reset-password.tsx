import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ResetPassword = () => {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract query params safely after hydration
  useEffect(() => {
    if (router.isReady) {
      const { uid, token } = router.query;
      if (typeof uid === 'string' && typeof token === 'string') {
        setUid(uid);
        setToken(token);
      } else {
        setMessage('❌ Invalid reset link.');
      }
    }
  }, [router.isReady, router.query]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!uid || !token) {
      setMessage('❌ Missing UID or Token.');
      return;
    }

    if (newPassword.length < 8) {
      setMessage('❌ Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/reset-password`, {
        userId: uid,
        token,
        newPassword,
      });
      setMessage('✅ Password reset successfully!');
    } catch (error: unknown) {
      console.error(error);
    
      // Optionally, check if it's an AxiosError or a general Error
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
    
      setMessage('❌ Failed to reset password.');
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
    >
      <div className="p-8 bg-white bg-opacity-10 shadow-lg backdrop-blur-sm border border-white border-opacity-30 rounded-xl max-w-md w-full">
        <h1 className="text-center text-black font-bold text-2xl mb-6">Reset Password</h1>

        <form onSubmit={handleReset} className="flex flex-col">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="p-3 mb-4 border border-gray-300 rounded-md bg-opacity-80 bg-white focus:outline-none focus:ring focus:ring-blue-500 text-black"
            disabled={loading || !uid || !token}
          />

          <button
            type="submit"
            className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
            disabled={loading || !uid || !token}
          >
            {loading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                Resetting...
              </span>
            ) : (
              'Reset Password'
            )}
          </button>

          {message && <p className="text-white text-center mt-4">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

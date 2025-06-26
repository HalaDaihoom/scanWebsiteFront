import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout'; // Adjusted for pages/layouts/Layout.tsx

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

const XssScannerPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = Cookies.get('token');
    if (!token) {
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/xss/scan-requests`,
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      let { redirectUrl } = response.data;
      console.log('Response:', response.data);

      if (redirectUrl) {
        // Prepend '/scanner' to redirectUrl if it starts with '/xss/scan-results'
        if (redirectUrl.startsWith('/xss/scan-results')) {
          redirectUrl = `/scanner${redirectUrl}`;
        }
        router.push(redirectUrl); // Redirect to /scanner/xss/scan-results/{scanId}
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } catch (err) {
      setError('An error occurred during scan submission. Please try again.');
      console.error('Scan submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">XSS Scanner</h1>
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
          <label className="text-lg mb-2 text-gray-800">
            Website URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full text-gray-800"
              placeholder="Enter website URL (e.g., https://example.com)"
              required
            />
          </label>
          <button
            type="submit"
            className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded flex items-center justify-center hover:bg-[#2A2A4D] transition-colors"
            disabled={loading}
          >
            {loading && (
              <div className="loader mr-2">
                <div className="circle"></div>
              </div>
            )}
            {loading ? 'Scanning...' : 'Start XSS Scan'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>

      <style jsx>{`
        .loader {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Layout>
  );
};

export default XssScannerPage;
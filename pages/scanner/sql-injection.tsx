
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SQLScannerPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
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
        `${API_URL}/api/sql-scan-requests`,
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Scan response:', response.data);

      const redirectUrl = response.data.redirectUrl;
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } 
    catch (err: unknown) {
      console.error('Scan error:', err);
    
      let errorMessage = 'Failed to initiate SQL scan.';
    
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const response = (err as { response?: any }).response;
    
        if (response?.data?.Results?.[0]?.Details) {
          errorMessage = response.data.Results[0].Details;
        } else if (response?.data?.Message) {
          errorMessage = response.data.Message;
        }
      }
    
      setError(errorMessage);
    }
    
    finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">SQL Injection Scanner</h1>
        <form onSubmit={handleSubmit} className="flex flex-col w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
          <label className="text-lg mb-4">
            URL:
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter URL (e.g., https://example.com)"
              required
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-500"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin mr-2 h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
                Scanning...
              </span>
            ) : (
              'Start SQL Scan'
            )}
          </button>
        </form>
        {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
      </main>
    </Layout>
  );
};

export default SQLScannerPage;

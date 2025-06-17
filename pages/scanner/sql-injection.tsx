
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SQLScannerPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [deepScan, setDeepScan] = useState<boolean>(false);
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
      `${API_URL}/api/scan`,
      { url, deepScan },
      { headers: { Authorization: `Bearer ${token}` } }
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
  
    if (
      typeof err === 'object' &&
      err !== null &&
      'response' in err &&
      typeof (err as any).response === 'object'
    ) {
      const response = (err as any).response;
      const results = response?.data?.Results;
      const message = response?.data?.Message;
  
      if (Array.isArray(results) && results[0]?.Details) {
        errorMessage = results[0].Details;
      } else if (typeof message === 'string') {
        errorMessage = message;
      }
    }
  
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
  
  // catch (err: any) {
  //   console.error('Scan error:', err.response?.data);
  //   const errorMessage = err.response?.data?.Results?.[0]?.Details || 
  //                       err.response?.data?.Message || 
  //                       'Failed to initiate SQL scan.';
  //   setError(errorMessage);
  // } finally {
  //   setLoading(false);
  // }
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
          <label className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={deepScan}
              onChange={(e) => setDeepScan(e.target.checked)}
              className="mr-2 h-5 w-5 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-lg">Deep Scan</span>
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
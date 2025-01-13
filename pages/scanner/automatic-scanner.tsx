import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const AutomaticScannerPage: React.FC = () => {
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
        'http://localhost:5000/api/scanners/automatic-scanner',
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { redirectUrl } = response.data;
      console.log('Response:', response.data);

      if (redirectUrl) {
        router.push(redirectUrl); // Redirect to the scan-results page
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } catch (err) {
      setError('An error occurred during scan submission.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Automatic Scanner</h1>
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
          <label className="text-lg mb-2">
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter URL"
              required
            />
          </label>
          <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded" disabled={loading}>
            {loading ? 'Scanning...' : 'Scan'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </Layout>
  );
};

export default AutomaticScannerPage;



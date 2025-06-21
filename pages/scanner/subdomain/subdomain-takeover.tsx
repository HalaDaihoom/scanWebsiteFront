import React, { useState } from 'react';
import Layout from '../../Layout';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
const Home = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('token'); 

      if (!token) {
        setError('You must be logged in to perform this action.');
        router.push('/login');
        return;
      }

      const response = await fetch('https://scan-website.runasp.net/api/scan-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(url),

      });

      const text = await response.text();

      if (!text.trim()) {
        throw new Error('Empty response from server');
      }

      const data = JSON.parse(text);

      if (!response.ok) {
        throw new Error(data.message || 'Scan failed');
      }

      // Redirect with scanId
      router.push(`/scanner/subdomain/subdomain-result?scanId=${data.scanId}`);
    } 
    catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error');
      }
    }
    
    // catch (err: any) {
    //   setError(err.message || 'Unexpected error');
    // }

    setLoading(false);
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Subdomain Takeover</h1>
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg text-black">
          <label className="text-lg mb-2">
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter URL to scan for Subdomain Takeover"
              required
            />
          </label>

          <button
            type="submit"
            className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded"
            disabled={loading}
          >
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </main>
    </Layout>
  );
};

export default Home;

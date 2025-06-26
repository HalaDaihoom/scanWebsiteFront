import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Layout from '../../Layout';
import axios, { AxiosError } from 'axios';



const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000' || 'https://6d63-156-209-31-59.ngrok-free.app';

export default function SubdomainTakeover() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = Cookies.get('token');
    if (!token) {
      setError('You are not authorized.');
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/Scan-with-subzy`,
        { domain },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
    
      // Store results in sessionStorage
      sessionStorage.setItem('subzyResults', JSON.stringify(response.data.results));
      sessionStorage.setItem('domain', domain);
    
      router.push('/scanner/subdomain/subdomain-result');
    } catch (err: unknown) {
      console.error('Scan error:', err);
    
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Scan failed.');
      } else {
        setError('Scan failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
    <main className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Subdomain Takeover Scanner</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
          placeholder="Enter domain e.g. example.com"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={loading}
        >
          {loading ? 'Scanning...' : 'Start Scan'}
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </form>
    </main>
    </Layout>
  );
}

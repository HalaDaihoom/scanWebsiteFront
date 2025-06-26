// pages/scanner/subdomain-finder.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SubdomainFinderScanPage: React.FC = () => {
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
      setLoading(false);
      router.push('/login');
      return;
    }

    // Just redirect with domain query param
    router.push(`/scanner/subdomain-finder-result?domain=${encodeURIComponent(domain)}`);
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-6">Subdomain Finder</h1>
        <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded shadow-lg w-full max-w-2xl">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. glitch.me)"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#1A1A3D] text-white rounded"
          >
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </main>
    </Layout>
  );
};

export default SubdomainFinderScanPage;

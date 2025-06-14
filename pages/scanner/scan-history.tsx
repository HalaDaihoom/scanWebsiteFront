// pages/subdomain-checker.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SubdomainChecker: React.FC = () => {
  const [subdomain, setSubdomain] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token is missing.');
        return;
      }

      const response = await axios.post(
        `${API_URL}/api/scan-subdomain`,
        { url: subdomain },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data?.message || 'No response from server.');
    } catch (err: any) {
      console.error(err);
      setError('Failed to contact server or scan subdomain.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">
          🔍 Subdomain Takeover Checker
        </h1>

        <div className="flex flex-col items-center space-y-4">
          <input
            type="text"
            placeholder="Enter subdomain (e.g., test.example.com)"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white w-80 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleCheck}
            disabled={loading || !subdomain.trim()}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check'}
          </button>
        </div>

        {error && (
          <p className="text-red-400 text-lg mt-5">{error}</p>
        )}

        {result && (
          <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-lg w-[90%] max-w-xl text-center">
            <p className="text-indigo-300 font-semibold text-lg">{result}</p>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default SubdomainChecker;

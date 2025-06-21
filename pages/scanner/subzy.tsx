// pages/scanner/subzy.tsx
import React, { useState } from 'react';
import axios from 'axios';
import Layout from '../Layout';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const SubzyScan = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        'http://localhost:5000/api/Scan-with-subzy',
        { domain },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // Save the results in local storage
      localStorage.setItem('subzy_results', JSON.stringify(response.data.results));
      localStorage.setItem('scanned_domain', domain);

      // Redirect to result page
      router.push('/scanner/subzy-result');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Subzy Subdomain Scan</h1>
        <form onSubmit={handleScan} className="space-y-4">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g., example.com)"
            required
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
        </form>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </Layout>
  );
};

export default SubzyScan;

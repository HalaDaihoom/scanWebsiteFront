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
        `https://d206-156-209-61-245.ngrok-free.app/api/takeovers`,
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
      <main className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
        {/* Left side - Information */}
        <section className="lg:w-1/2 p-10 flex flex-col justify-center bg-gray-800 border-r border-gray-700">
          <h1 className="text-4xl font-bold text-indigo-400 mb-6">Subdomain Takeover Scanner</h1>
          <p className="text-lg mb-4">
            This tool scans for potential <strong>Subdomain Takeover</strong> vulnerabilities, which occur when a subdomain points to an external service (like GitHub, Heroku, etc.) that is no longer claimed. Attackers can hijack these subdomains to serve malicious content or intercept traffic.
          </p>
          <p className="text-lg mb-4">
            We use <strong>Assetfinder</strong> to enumerate subdomains of the target domain and <strong>Subzy</strong> to analyze them for known takeover patterns. The scanner inspects DNS records and compares them against a list of vulnerable services.
          </p>
          <p className="text-lg mb-4">
            Enter a domain on the right to start scanning. Once complete, you’ll get a detailed list of subdomains with indicators showing whether they are safe or <span className="text-red-400 font-semibold">vulnerable</span>. You can also download a full PDF report of the scan results.
          </p>
          <p className="text-sm italic text-gray-400 mt-2">
            Warning: Only scan domains you own or have explicit permission to test.
          </p>
        </section>



        {/* Right side - Form */}
        <section className="lg:w-1/2 p-10 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg"
          >
            <label className="text-lg mb-4">
              Domain
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., example.com"
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
                'Start'
              )}
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          </form>
        </section>
      </main>
    </Layout>
    // <Layout>
    // <main className="p-6 max-w-xl mx-auto text-center">
    //   <h1 className="text-2xl font-bold mb-4">Subdomain Takeover Scanner</h1>
    //   <form onSubmit={handleSubmit}>
    //     <input
    //       type="text"
    //       value={domain}
    //       onChange={(e) => setDomain(e.target.value)}
    //       className="w-full p-2 border border-gray-300 rounded mb-4"
    //       placeholder="Enter domain e.g. example.com"
    //       required
    //     />
    //     <button
    //       type="submit"
    //       className="bg-blue-600 text-white px-4 py-2 rounded w-full"
    //       disabled={loading}
    //     >
    //       {loading ? 'Scanning...' : 'Start Scan'}
    //     </button>
    //     {error && <p className="text-red-500 mt-4">{error}</p>}
    //   </form>
    // </main>
    // </Layout>
  );
}

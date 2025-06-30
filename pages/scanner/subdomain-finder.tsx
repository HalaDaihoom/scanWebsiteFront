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
      <main className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
        {/* Left side - Information */}
        <section className="lg:w-1/2 p-10 flex flex-col justify-center bg-gray-800 border-r border-gray-700">
          <h1 className="text-4xl font-bold text-indigo-400 mb-6">Subdomain Finder</h1>
          <p className="text-lg mb-4">
            <strong>Subdomain Finder</strong> helps identify all subdomains linked to a given domain. This is crucial for uncovering hidden assets and potential vulnerabilities in large web infrastructures.
          </p>
          <p className="text-lg mb-4">
            Our tool gathers subdomains from multiple trusted sources including <strong>crt.sh</strong>, <strong>VirusTotal</strong>, and <strong>AlienVault OTX</strong>. This ensures a broad and reliable discovery process.
          </p>
          <p className="text-lg mb-4">
            Simply enter a domain on the right, and we’ll scan for related subdomains, displaying the total found and detailed information for each. This is especially helpful for security researchers and penetration testers.
          </p>
          <p className="text-sm italic text-gray-400 mt-2">Note: Only scan domains you own or have explicit permission to analyze.</p>
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
    //   <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
    //     <h1 className="text-3xl mb-6">Subdomain Finder</h1>
    //     <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded shadow-lg w-full max-w-2xl">
    //       <input
    //         type="text"
    //         value={domain}
    //         onChange={(e) => setDomain(e.target.value)}
    //         placeholder="Enter domain (e.g. glitch.me)"
    //         className="w-full p-2 border border-gray-300 rounded mb-4"
    //         required
    //       />
    //       <button
    //         type="submit"
    //         disabled={loading}
    //         className="w-full py-2 px-4 bg-[#1A1A3D] text-white rounded"
    //       >
    //         {loading ? 'Scanning...' : 'Start Scan'}
    //       </button>
    //       {error && <p className="text-red-500 mt-4">{error}</p>}
    //     </form>
    //   </main>
    // </Layout>
  );
};

export default SubdomainFinderScanPage;

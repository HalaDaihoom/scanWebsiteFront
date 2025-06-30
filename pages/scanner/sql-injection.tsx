
// pages/SQLScannerPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

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

  const isValidUrl = (input: string): boolean => {
    const urlRegex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    return urlRegex.test(input);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setLoading(true);

    const token = Cookies.get('token');
    if (!token) {
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/sql-scan-requests',
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const redirectUrl = response.data.redirectUrl;
      if (redirectUrl) {
        router.push(redirectUrl);
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to initiate SQL scan.';
    
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object'
      ) {
        const response = (err as any).response;
        errorMessage =
          response?.data?.Results?.[0]?.Details ||
          response?.data?.Message ||
          errorMessage;
      }
    
      setError(errorMessage);
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
        {/* Left side - Information */}
        <section className="lg:w-1/2 p-10 flex flex-col justify-center bg-gray-800 border-r border-gray-700">
          <h1 className="text-4xl font-bold text-indigo-400 mb-6">SQL Injection Scanner</h1>
          <p className="text-lg mb-4">
            <strong>SQL Injection</strong> is a serious security vulnerability that allows attackers to interfere with the queries an application makes to its database. This can lead to unauthorized data access, data loss, and even full system compromise.
          </p>
          <p className="text-lg mb-4">
            Our scanner uses automated tools to detect SQL injection vulnerabilities on your website by simulating attack vectors. The scanner performs a spidering process followed by injection tests to identify any weaknesses.
          </p>
          <p className="text-lg mb-4">
            Enter a valid URL on the right, and we&apos;ll start scanning your website for potential SQL injection flaws. The scan may take a few minutes to complete.
          </p>
          <p className="text-sm italic text-gray-400 mt-2">Note: Only scan websites you own or have permission to test.</p>
        </section>

        {/* Right side - Form */}
        <section className="lg:w-1/2 p-10 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg"
          >
            <label className="text-lg mb-4">
              Website URL:
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., https://example.com"
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
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default SQLScannerPage;

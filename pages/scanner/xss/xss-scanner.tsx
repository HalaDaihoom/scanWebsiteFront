import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const XssScannerPage: React.FC = () => {
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
        `${API_URL}/api/xss/scan-requests`,
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      let { redirectUrl } = response.data;

      if (redirectUrl) {
        if (redirectUrl.startsWith('/xss/scan-results')) {
          redirectUrl = `/scanner${redirectUrl}`;
        }
        router.push(redirectUrl);
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } catch (err: unknown) {
      let errorMessage = 'Failed to initiate XSS scan.';
    
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
          <h1 className="text-4xl font-bold text-indigo-400 mb-6">XSS Scanner</h1>
          <p className="text-lg mb-4">
            Cross-Site Scripting (XSS) is a critical security vulnerability that allows attackers to inject malicious scripts into web pages viewed by users. This can result in stolen data, session hijacking, or website defacement, making it essential to identify and mitigate such risks.
          </p>
          <ul className="list-disc list-inside text-lg space-y-4">
            <li>Our scanner detects both <strong>reflected</strong> and <strong>stored XSS</strong> vulnerabilities by crawling your site and testing for script injection points.</li>
            <li>Simulates common XSS attack vectors safely to identify weaknesses.</li>
            <li>Analyzes forms and query strings for potential vulnerabilities.</li>
            <li>Generates a detailed vulnerability report for your review.</li>
          </ul>
          <p className="text-sm italic text-gray-400 mt-6">Note: Only scan websites you own or have permission to test.</p>
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
                'Start XSS Scan'
              )}
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default XssScannerPage;
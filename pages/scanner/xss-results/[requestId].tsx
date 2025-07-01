import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout';

interface ScanResult {
  xssType: string;
  affectedUrl: string;
  risk: string;
  confidence: string;
  description: string;
  solution: string;
  payload: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const XSSScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const router = useRouter();
  const { requestId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!requestId) {
          setError('Request ID is missing.');
          setLoading(false);
          return;
        }

        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          setLoading(false);
          return;
        }

        const parsedRequestId = Array.isArray(requestId) ? requestId[0] : requestId;

        const response = await axios.get(
          `${API_URL}/api/xss/scan-results/${parsedRequestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.Results.map((item: any) => JSON.parse(item.Details));
        setResults(data);
        setMessage(response.data.Message || 'XSS scan results loaded successfully.');
      } catch (err: unknown) {
        console.error('API Error:', err);
      
        let errorMessage = 'Failed to load XSS scan results.';
      
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as any).response === 'object'
        ) {
          const response = (err as any).response;
          errorMessage = response?.data?.message || errorMessage;
        }
      
        setError(errorMessage);
      }
      finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchResults();
    }
  }, [requestId, router]);

  const toggleDetails = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    return text?.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-start min-h-screen py-10 px-4 bg-gray-950 text-gray-100">
        <h1 className="text-4xl font-bold text-center mb-8 text-indigo-400 border-b border-indigo-500 pb-2">
          XSS Scan Results
        </h1>

        {requestId && !loading && (
          <a
            href={`/scanner/xss-results/${requestId}/pdf`}
            className="mb-6 px-5 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-200"
          >
            ⬇ Download XSS Report
          </a>
        )}

        {loading && (
          <p className="text-gray-400 mb-6 text-lg animate-pulse">Loading XSS scan results...</p>
        )}
        {message && <p className="text-green-400 mb-4 text-center">{message}</p>}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {!loading && results.length === 0 && !error && (
          <div className="text-center mt-10 text-gray-400">
            <p className="text-2xl mb-2">✅ No XSS vulnerabilities found!</p>
            <p className="text-sm">Your scan didn&#39;t detect any XSS issues.</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <section className="w-full max-w-5xl space-y-6 mt-6">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg transition hover:shadow-xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-red-400">
                    ⚠ {result.xssType} Vulnerability
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.risk === 'High'
                        ? 'bg-red-500 text-white'
                        : result.risk === 'Medium'
                        ? 'bg-yellow-400 text-black'
                        : 'bg-green-500 text-white'
                    }`}
                  >
                    {result.risk} ({result.confidence})
                  </span>
                </div>

                <div className="text-sm space-y-2 text-gray-300">
                  <p><strong>🔗 Affected URL:</strong> {truncateText(result.affectedUrl, 100)}</p>
                  <p><strong>🧪 Payload:</strong> {truncateText(result.payload, 80)}</p>
                  <p><strong>📖 Description:</strong> {truncateText(result.description, 200)}</p>
                </div>

                <button
                  onClick={() => toggleDetails(index)}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm underline"
                >
                  {expandedIndices.includes(index) ? '▲ Hide Details' : '▼ Show Details'}
                </button>

                {expandedIndices.includes(index) && (
                  <div className="mt-4 bg-gray-700 text-gray-200 p-4 rounded-md text-sm space-y-3">
                    <div>
                      <strong>🛠 Solution:</strong>
                      <div className="mt-1 whitespace-pre-line">{result.solution}</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
      </main>
    </Layout>
  );
};

export default XSSScanResultsPage;
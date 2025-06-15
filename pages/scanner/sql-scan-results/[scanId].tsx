import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ScanResult {
  vulnerabilityType: string | null;
  vulnerabilityId: number | null;
  severity: string;
  details: string;
  summary: string;
  payloadUsed: string | null;
  url: string;
}

const SQLScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const router = useRouter();
  const { scanId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!scanId) {
          setError('Scan ID is missing.');
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

        const parsedScanId = Array.isArray(scanId) ? scanId[0] : scanId;

        const response = await axios.get(
          `${API_URL}/api/sql-result/${parsedScanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(response.data?.$values)
          ? response.data.$values
          : response.data;

        setResults(data);
        setMessage(data.length > 0 ? 'SQL injection scan results loaded successfully.' : 'No SQL vulnerabilities found.');
      } catch (err: any) {
        console.error('API Error:', err);
        const errorMessage = err.response?.data
          ? typeof err.response.data === 'string'
            ? err.response.data
            : JSON.stringify(err.response.data)
          : 'Failed to load SQL scan results. Please try again later.';
        setError(errorMessage);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (router.isReady) {
      fetchResults();
    }
  }, [scanId, router]);

  const toggleDetails = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-gray-100">
        <h1 className="text-4xl font-semibold mb-6 text-indigo-400 border-b-2 border-indigo-400 pb-2">SQL Injection Scan Results</h1>

        {scanId && (
          <a
            href={`/scanner/sql-scan-report/${scanId}`}
            className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Download SQL Report
          </a>
        )}

        {loading && <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading SQL results...</p>}
        {message && <p className="text-green-400 text-lg mb-5">{message}</p>}
        {error && <p className="text-red-400 text-lg mb-5">{error}</p>}

        {!loading && (
          <div className="w-full max-w-4xl space-y-6">
            {results.length === 0 ? (
              <p className="text-gray-400 text-center text-lg">No SQL vulnerabilities found.</p>
            ) : (
              results.map((result, index) => (
                <div key={result.vulnerabilityId ?? index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium text-red-400">Vulnerability: {result.vulnerabilityType ?? 'Unknown'}</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        result.severity === 'High'
                          ? 'bg-red-500 text-white'
                          : result.severity === 'Medium'
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {result.severity}
                    </span>
                  </div>

                  <p className="text-gray-300 mb-2"><strong>URL:</strong> {truncateText(result.url, 100)}</p>
                  <p className="text-gray-300 mb-2"><strong>Description:</strong> {result.details}</p>
                  {/* <p className="text-gray-300 mb-2"><strong>Summary:</strong> {result.summary}</p> */}

                  {/* <p className="text-gray-400 mb-2"><strong>Payload:</strong> <span className="text-sm bg-gray-700 p-1 rounded">{truncateText(result.payloadUsed ?? '', 50)}</span></p> */}

                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium focus:outline-none"
                  >
                    {expandedIndices.includes(index) ? '▲ Hide Details' : '▼ Show Details'}
                  </button>

                  {expandedIndices.includes(index) && (
                    <div className="mt-4 text-sm text-gray-300 bg-gray-700 p-4 rounded-md">
                      <strong>Details:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>URL:</strong> {truncateText(result.url, 100)}</li>
                        <li><strong>Payload Used:</strong> {truncateText(result.payloadUsed ?? '', 50)}</li>
                        <li><strong>Summary:</strong> {truncateText(result.summary,400)}</li>
                         {/* <li><strong>Description:</strong> {truncateText(result.details, 150)}</li> */}

                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </Layout>
  );
};

export default SQLScanResultsPage;


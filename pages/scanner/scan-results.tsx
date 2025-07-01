import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse, AxiosError } from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

interface ScanResult {
  severity: string;
  details: string;
}

interface ResultsResponse {
  message: string;
  results: {
    $values: ScanResult[];
  };
}

interface AxiosErrorResponse {
  message?: string;
}

interface ParsedDetails {
  Alert?: string;
  URL?: string;
  Risk?: string;
  Confidence?: string;
  Description?: string;
  Solution?: string;
  Reference?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const [summaryStatus, setSummaryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const router = useRouter();
  const { requestId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        if (!requestId) return;

        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          return;
        }

        const response: AxiosResponse<ResultsResponse> = await axios.get(
          `${API_URL}/api/scan-results/by-request/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setResults(response.data.results?.$values || []);
        setMessage(response.data.message || '');
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load scan results.');
        } else {
          setError('An unknown error occurred while loading results.');
          console.error('Unexpected error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [requestId, router]);

  const toggleDetails = (index: number) => {
    setExpandedIndices((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const formatDetails = (details: string | null | undefined) => {
    if (!details) {
      return <div className="text-sm text-gray-200">No details available.</div>;
    }

    try {
      const parsedDetails = JSON.parse(details) as ParsedDetails;

      return (
        <div className="text-sm text-gray-200 bg-gray-700 p-3 rounded-md mt-2">
          {parsedDetails.Alert && (
            <div>
              <span className="font-semibold text-red-400">Alert:</span> {parsedDetails.Alert}
            </div>
          )}
          {parsedDetails.URL && (
            <div>
              <span className="font-semibold text-indigo-400">URL:</span>{' '}
              <a href={parsedDetails.URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {parsedDetails.URL}
              </a>
            </div>
          )}
          {parsedDetails.Risk && (
            <div>
              <span className="font-semibold text-yellow-400">Risk:</span> {parsedDetails.Risk}
            </div>
          )}
          {parsedDetails.Confidence && (
            <div>
              <span className="font-semibold text-green-400">Confidence:</span> {parsedDetails.Confidence}
            </div>
          )}
          {parsedDetails.Description && (
            <div className="mt-2">
              <span className="font-semibold text-gray-300">Description:</span> {parsedDetails.Description}
            </div>
          )}
          {parsedDetails.Solution && (
            <div className="mt-2">
              <span className="font-semibold text-green-400">Solution:</span> {parsedDetails.Solution}
            </div>
          )}
          {parsedDetails.Reference && (
            <div className="mt-2">
              <span className="font-semibold text-yellow-400">Reference:</span>{' '}
              <a href={parsedDetails.Reference} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {parsedDetails.Reference}
              </a>
            </div>
          )}
        </div>
      );
    } catch (err) {
      console.error('Failed to parse details:', err);
      return <div className="text-sm text-gray-200">Invalid details format.</div>;
    }
  };

  const handleGenerateSummary = async () => {
    setSummaryStatus('loading');
    setSummaryError(null);
    try {
      const token = Cookies.get('token');
      if (!token) {
        setSummaryStatus('error');
        setSummaryError('Authentication token is missing.');
        router.push('/login');
        return;
      }

      await axios.post(
        `${API_URL}/api/summarize-scan-results`,
        { requestId: Number(requestId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummaryStatus('success');
    } catch (error: unknown) {
      setSummaryStatus('error');
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<AxiosErrorResponse>;
        if (axiosError.response?.status === 500 && axiosError.response?.data?.message?.includes('too large')) {
          setSummaryError('The report is too big to be summarized.');
        } else {
          setSummaryError('Failed to generate summary. Please try again later.');
        }
      } else {
        setSummaryError('An unexpected error occurred while generating the summary.');
        console.error('Summary generation failed:', error);
      }
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">Scan Results Report</h1>
        {loading && <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading reports...</p>}
        {message && <p className="text-green-400 text-lg mb-5">{message}</p>}
        {error && <p className="text-red-400 text-lg mb-5">{error}</p>}

        {!loading && (
          <>
            <div className="w-full max-w-4xl space-y-4">
              {results.length === 0 ? (
                <p className="text-gray-400 text-center text-lg">
                  Your scan didn&apos;t detect any issues.
                </p>
              ) : (
                results.map((result, index) => {
                  let alertText = 'Unknown Alert';
                  const hasDetails = result.details && result.details.trim() !== '';

                  try {
                    if (hasDetails) {
                      const parsedDetails = JSON.parse(result.details) as ParsedDetails;
                      alertText = parsedDetails.Alert || 'Unknown Alert';
                    }
                  } catch (err) {
                    console.error('Failed to parse details:', err);
                  }

                  return (
                    <div key={index} className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl">
                      <div className="mb-2">
                        <span className="text-lg font-semibold text-red-400">Alert:</span>
                        <span className="text-lg font-medium text-gray-300 ml-2">{alertText}</span>
                      </div>

                      <div className="mb-2">
                        <span className="text-lg font-semibold text-indigo-400">Severity:</span>
                        <span
                          className={`text-lg font-medium ml-2 ${
                            result.severity === 'High'
                              ? 'text-red-400'
                              : result.severity === 'Medium'
                              ? 'text-yellow-400'
                              : 'text-green-400'
                          }`}
                        >
                          {result.severity}
                        </span>
                      </div>

                      <button
                        onClick={() => toggleDetails(index)}
                        className="text-indigo-400 hover:text-indigo-300 focus:outline-none"
                      >
                        {expandedIndices.includes(index) ? '▲ Hide Details' : '▼ Show Details'}
                      </button>

                      {expandedIndices.includes(index) && (
                        <div className="mt-4">
                          <span className="text-lg font-semibold text-indigo-400">Details:</span>
                          {formatDetails(result.details)}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {requestId && (
              <div className="mt-4 flex flex-col items-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleGenerateSummary}
                    disabled={summaryStatus === 'loading'}
                    className={`px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded shadow ${
                      summaryStatus === 'loading' ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    Generate Summary
                  </button>
                  {summaryStatus === 'loading' && (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  )}
                </div>
                {summaryStatus === 'success' && (
                  <button
                    onClick={() => router.push(`/scanner/summary?requestId=${requestId}`)}
                    className="mt-4 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded shadow"
                  >
                    View Summary
                  </button>
                )}
                {summaryError && <p className="text-red-400 text-lg mt-2">{summaryError}</p>}
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
};

export default ScanResultsPage;

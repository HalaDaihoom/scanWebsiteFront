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
          `${API_URL}/api/scan-result/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.results && response.data.results.$values) {
          setResults(response.data.results.$values);
        } else {
          setResults([]);
        }

        setMessage(response.data.message || '');
      } catch (err) {
        setError('Failed to load scan results. Please try again later.');
        console.error(err);
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
      const parsedDetails = JSON.parse(details);
      const { URL, Risk, Confidence, Description, Solution, Reference } = parsedDetails;

      return (
        <div className="text-sm text-gray-200 bg-gray-700 p-3 rounded-md mt-2">
          {parsedDetails.Alert && (
            <div>
              <span className="font-semibold text-red-400">Alert:</span> {parsedDetails.Alert}
            </div>
          )}
          {URL && (
            <div>
              <span className="font-semibold text-indigo-400">URL:</span>{' '}
              <a href={URL} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {URL}
              </a>
            </div>
          )}
          {Risk && (
            <div>
              <span className="font-semibold text-yellow-400">Risk:</span> {Risk}
            </div>
          )}
          {Confidence && (
            <div>
              <span className="font-semibold text-green-400">Confidence:</span> {Confidence}
            </div>
          )}
          {Description && (
            <div className="mt-2">
              <span className="font-semibold text-gray-300">Description:</span> {Description}
            </div>
          )}
          {Solution && (
            <div className="mt-2">
              <span className="font-semibold text-green-400">Solution:</span> {Solution}
            </div>
          )}
          {Reference && (
            <div className="mt-2">
              <span className="font-semibold text-yellow-400">Reference:</span>{' '}
              <a href={Reference} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">
                {Reference}
              </a>
            </div>
          )}
        </div>
      );
    } catch (err) {
      console.error("Failed to parse details:", err);
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
    } catch (error) {
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
      }
      console.error('Summary generation failed:', error);
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
                <p className="text-gray-400 text-center text-lg">No vulnerabilities found.</p>
              ) : (
                results.map((result, index) => {
                  let alertText = "Unknown Alert";
                  const hasDetails = result.details && result.details.trim() !== "";

                  try {
                    if (hasDetails) {
                      const parsedDetails = JSON.parse(result.details);
                      alertText = parsedDetails.Alert || "Unknown Alert";
                    }
                  } catch (err) {
                    console.error("Failed to parse details:", err);
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
                {summaryError && (
                  <p className="text-red-400 text-lg mt-2">{summaryError}</p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </Layout>
  );
};

export default ScanResultsPage;
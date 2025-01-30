
import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
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

const ScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Initial state is true
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]); // Track expanded items
  const router = useRouter();
  const { scanId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      // Reset loading state when starting a new fetch
      setLoading(true);

      try {
        if (!scanId) return;

        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          return;
        }

        const response: AxiosResponse<ResultsResponse> = await axios.get(
          `http://localhost:5000/api/scanners/automatic-scanner/scan-results?scanId=${scanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Response data:', response.data);
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
        setLoading(false); // Stop loading after fetch completes
      }
    };

    fetchResults();
  }, [scanId, router]); // Run whenever `scanId` changes

  // Toggle dropdown for a specific vulnerability
  const toggleDetails = (index: number) => {
    if (expandedIndices.includes(index)) {
      // If already expanded, collapse it
      setExpandedIndices(expandedIndices.filter((i) => i !== index));
    } else {
      // If not expanded, add it to the expanded list
      setExpandedIndices([...expandedIndices, index]);
    }
  };

  // Format JSON details with proper line breaks and indentation
  const formatDetails = (details: string) => {
    try {
      const parsedDetails = JSON.parse(details);
      return JSON.stringify(parsedDetails, null, 2)
        .split('\n')
        .map((line, index) => {
          // Check if the line contains the "Description" field
          if (line.includes('"Description":')) {
            const [key, value] = line.split(':');
            return (
              <div key={index} className="whitespace-pre-wrap break-words">
                {key}:{value}
              </div>
            );
          }
          return (
            <div key={index} className="whitespace-pre-wrap break-words">
              {line}
            </div>
          );
        });
    } catch (error) {
      return details; // Fallback to raw details if parsing fails
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">Scan Results Report</h1>
        {loading && (
          <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading reports...</p>
        )}
        {message && (
          <p className="text-green-400 text-lg mb-5">{message}</p>
        )}
        {error && (
          <p className="text-red-400 text-lg mb-5">{error}</p>
        )}

        {!loading && (
          <div className="w-full max-w-4xl space-y-4">
            {results.length === 0 ? (
              <p className="text-gray-400 text-center text-lg">No vulnerabilities found.</p>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-indigo-400">Severity:</span>
                      <span
                        className={`text-lg font-medium ${
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
                  </div>
                  {expandedIndices.includes(index) && (
                    <div className="mt-4">
                      <span className="text-lg font-semibold text-indigo-400">Details:</span>
                      <div className="text-sm text-gray-200 bg-gray-700 p-3 rounded-md mt-2">
                        {formatDetails(result.details)}
                      </div>
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

export default ScanResultsPage;
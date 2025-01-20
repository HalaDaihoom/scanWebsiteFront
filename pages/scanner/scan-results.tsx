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

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Scan Results</h1>
        {loading && <p className="text-gray-300 mb-5">Loading reports...</p>}
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && (
          <div className="w-full max-w-4xl bg-[#1A1A3D] text-white p-5 rounded shadow-lg">
            {results.length === 0 && <p className="text-gray-400">No results found.</p>}
            <ul>
              {results.map((result, index) => (
                <li key={index} className="border-b py-3">
                  <strong>Severity:</strong> {result.severity}
                  <br />
                  <strong>Details:</strong> {result.details}
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default ScanResultsPage;

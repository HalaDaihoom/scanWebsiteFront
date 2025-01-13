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
    $values: ScanResult[]; // Adjust the structure based on your API response
  };
}

const ScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { scanId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
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
        // Check if 'results' exist and access them properly
        if (response.data.results && response.data.results.$values) {
          setResults(response.data.results.$values); // Accessing $values
        } else {
          setResults([]); // Set empty array if no results
        }

        setMessage(response.data.message || ''); // Set message if exists
      } catch (err) {
        setError('Failed to load scan results. Please try again later.');
        console.error(err);
      }
    };

    fetchResults();
  }, [scanId, router]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Scan Results</h1>
        {message && <p className="text-green-500">{message}</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        {/* The area where the results and messages appear */}
        <div className="w-full max-w-4xl bg-[#1A1A3D] text-white p-5 rounded shadow-lg">
          <ul>
            {results.length > 0 ? (
              results.map((result, index) => (
                <li key={index} className="border-b py-3">
                  <strong>Severity:</strong> {result.severity}
                  <br />
                  <strong>Details:</strong> {result.details}
                </li>
              ))
            ) : (
              <li className="text-center py-3 text-gray-300">No scan results available.</li>
            )}
          </ul>
        </div>
      </main>
    </Layout>
  );
};

export default ScanResultsPage;

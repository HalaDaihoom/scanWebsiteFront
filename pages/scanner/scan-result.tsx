import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

interface Alert {
  Alert: string;
  Risk: string;
  Url: string;
  Param: string;
  Evidence: string;
  Solution: string;
}

interface ScanResult {
  Message: string;
  Results: Alert[];
}

const ScanResults: React.FC = () => {
  const [results, setResults] = useState<Alert[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { scanId } = router.query;

  useEffect(() => {
    if (!scanId) return;

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      const token = Cookies.get('token'); // Get the token from cookies
      if (!token) {
        setError('You must be logged in.');
        router.push('/login'); // Redirect to login page
        return;
      }

      try {
        const response = await axios.get<ScanResult>(
          `http://localhost:5000/api/scanners/automatic-scanner/scan-results`,
          {
            params: { scanId },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.Results && response.data.Results.length > 0) {
          setResults(response.data.Results);
        } else {
          setError('No scan results available for the given scan ID.');
        }
      } catch (err) {
        console.error('Error fetching scan results:', err);
        setError('Failed to fetch scan results. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [scanId, router]);

  if (loading) {
    return (
      <Layout>
        <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
          <h1 className="text-3xl mb-5">Fetching Results...</h1>
        </main>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
          <h1 className="text-3xl mb-5 text-red-500">Error</h1>
          <p>{error}</p>
        </main>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Scan Results</h1>
        <div className="max-w-4xl w-full bg-white p-5 rounded shadow-lg text-black">
          {results ? (
            <ul>
              {results.map((alert, index) => (
                <li key={index} className="mb-4 p-4 bg-gray-100 rounded shadow">
                  <p><strong>Alert:</strong> {alert.Alert}</p>
                  <p><strong>Risk:</strong> {alert.Risk}</p>
                  <p>
                    <strong>URL:</strong>{' '}
                    <a
                      href={alert.Url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {alert.Url}
                    </a>
                  </p>
                  <p><strong>Param:</strong> {alert.Param}</p>
                  <p><strong>Evidence:</strong> {alert.Evidence}</p>
                  <p><strong>Solution:</strong> {alert.Solution}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No alerts found.</p>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default ScanResults;

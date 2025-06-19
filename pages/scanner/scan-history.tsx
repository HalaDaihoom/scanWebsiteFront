
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

interface ScanHistoryEntry {
  url: string;
  startedAt: string;
  zapScanId: number | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const ScanHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          return;
        }

        const response = await axios.get<{ $values: ScanHistoryEntry[] }>(
          `${API_URL}/api/scan-results`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Extracting the data from $values
        const data = response.data?.$values || [];
        setHistory(data);
      } catch (err) {
        setError('Failed to load scan history. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">Scan History</h1>
        {loading && (
          <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading history...</p>
        )}
        {error && (
          <p className="text-red-400 text-lg mb-5">{error}</p>
        )}

        {!loading && !error && history.length === 0 && (
          <p className="text-gray-400 text-center text-lg">No scan history found.</p>
        )}

        {!loading && history.length > 0 && (
          <div className="w-full max-w-4xl space-y-4">
            {history.map((entry, index) => (
              <div
                key={index}
                className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl"
              >
                <div className="space-y-2">
                  <p>
                    <strong className="text-indigo-400">Website URL:</strong>{' '}
                    <span className="text-gray-200">{entry.url}</span>
                  </p>
                  <p>
                    <strong className="text-indigo-400">Scan Date:</strong>{' '}
                    <span className="text-gray-200">
                      {new Date(entry.startedAt).toLocaleString()}
                    </span>
                  </p>
                  <a
                    href={`/scanner/scan-results?scanId=${entry.zapScanId}`}
                    className={`text-indigo-400 hover:text-indigo-300 hover:underline ${
                      entry.zapScanId === null ? 'pointer-events-none text-gray-500' : ''
                    }`}
                  >
                    {entry.zapScanId === null ? 'Report Unavailable' : 'View Report'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
};

export default ScanHistoryPage;
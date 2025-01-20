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
          'http://localhost:5000/api/scanners/history',
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
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Scan History</h1>
        {loading && <p className="text-gray-300">Loading history...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!loading && !error && history.length === 0 && (
          <p className="text-gray-400">No scan history found.</p>
        )}

        {!loading && history.length > 0 && (
          <div className="w-full max-w-4xl bg-[#1A1A3D] text-white p-5 rounded shadow-lg">
            <ul>
              {history.map((entry, index) => (
                <li key={index} className="border-b py-3">
                  <p>
                    <strong>Website URL:</strong> {entry.url}
                  </p>
                  <p>
                    <strong>Scan Date:</strong>{' '}
                    {new Date(entry.startedAt).toLocaleString()}
                  </p>
                  <a
                    href={`/scanner/scan-results?scanId=${entry.zapScanId}`}
                    className={`text-blue-400 hover:underline ${
                      entry.zapScanId === null ? 'pointer-events-none text-gray-500' : ''
                    }`}
                  >
                    {entry.zapScanId === null ? 'Report Unavailable' : 'View Report'}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
    </Layout>
  );
};

export default ScanHistoryPage;

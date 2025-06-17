/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const XSSScanReportPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { requestId } = router.query;

  useEffect(() => {
    const downloadReport = async () => {
      setLoading(true);

      try {
        if (!requestId) return;

        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/xss-scan/report/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob', // Handle binary data for PDF
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `xss-report-${requestId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        router.push(`/scanner/xss-scan-results/${requestId}`);
      } catch (err: any) {
        setError(err.response?.data || 'Failed to download XSS report. Please try again later.');
        console.error(err);
      } 
      finally {
        setLoading(false);
      }
    };

    downloadReport();
  }, [requestId, router]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">XSS Scan Report</h1>
        {loading && <p className="text-gray-400 mb-5 text-lg animate-pulse">Downloading report...</p>}
        {error && <p className="text-red-400 text-lg mb-5">{error}</p>}
      </main>
    </Layout>
  );
};

export default XSSScanReportPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SQLcanReportPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { requestId } = router.query;

  useEffect(() => {
    const fetchAndDownloadReport = async () => {
      if (!requestId) return;

      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing. Please log in again.');
          router.push('/login');
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/report/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: 'blob',
          }
        );

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', `sql-report-${requestId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);

        router.push(`/scanner/sql-scan-results/${requestId}`);
      } 
      catch (err: unknown) {
        console.error('Download error:', err);
      
        let message = 'An error occurred while downloading the report.';
      
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as any).response === 'object'
        ) {
          message = (err as any).response?.data || (err as any).message || message;
        } else if (err instanceof Error) {
          message = err.message;
        }
      
        setError(message);
      }
      
      // catch (err: any) {
      //   console.error('Download error:', err);
      //   const message =
      //     err?.response?.data ||
      //     err?.message ||
      //     'An error occurred while downloading the report.';
      //   setError(message);
      // 
      // }
     finally {
        setLoading(false);
      }
    };

    fetchAndDownloadReport();
  }, [requestId, router]);

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">SQL Scan Report</h1>
        {loading && (
          <p className="text-gray-400 mb-5 text-lg animate-pulse">
            Downloading your report...
          </p>
        )}
        {error && (
          <p className="text-red-400 text-lg mb-5">
            {typeof error === 'string' ? error : 'Unexpected error occurred.'}
          </p>
        )}
      </main>
    </Layout>
  );
};

export default SQLcanReportPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../Layout';

interface ScanResult {
  resultId: number;
  severity: string;
  details: string;
  summary: string;
  payloadUsed: string;
  vulnerabilityType: string;
  vulnerability: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const XSSScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const router = useRouter();
  const { requestId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!requestId) {
          setError('Request ID is missing.');
          setLoading(false);
          return;
        }

        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/xss-scan/results/${requestId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = Array.isArray(response.data.$values) ? response.data.$values : [];
        setResults(data);
        setMessage(data.length > 0 ? 'XSS scan results loaded successfully.' : 'No XSS vulnerabilities found.');
      }
      catch (err: unknown) {
        console.error('API Error:', err);
        let errorMessage = 'Failed to load XSS scan results. Please try again later.';
      
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as any).response === 'object'
        ) {
          const response = (err as any).response;
          const data = response?.data;
      
          if (typeof data === 'string') {
            errorMessage = data;
          } else {
            errorMessage = JSON.stringify(data);
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
      
        setError(errorMessage);
        setResults([]);
      }
            //  catch (err: any) {
      //   console.error('API Error:', err);
      //   const errorMessage = err.response?.data
      //     ? typeof err.response.data === 'string'
      //       ? err.response.data
      //       : JSON.stringify(err.response.data)
      //     : 'Failed to load XSS scan results. Please try again later.';
      //   setError(errorMessage);
      //   setResults([]);
      // }
       finally {
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

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleDownloadReport = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token is missing.');
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

    } 
    catch (err: unknown) {
      console.error('Download error:', err);
    
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object'
      ) {
        const response = (err as any).response;
        const message =
          response?.data?.message || 'Failed to download XSS report. Please try again later.';
        setError(message);
      } else {
        setError('Failed to download XSS report. Please try again later.');
      }
    }
    
    // catch (err: any) {
    //   setError('Failed to download XSS report. Please try again later.');
    //   console.error(err);
    // }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-gray-100">
        <h1 className="text-4xl font-semibold mb-6 text-indigo-400 border-b-2 border-indigo-400 pb-2">XSS Scan Results</h1>
        {requestId && (
          <button
            onClick={handleDownloadReport}
            className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-200"
          >
            Download XSS Report
          </button>
        )}
        {loading && <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading XSS results...</p>}
        {message && <p className="text-green-400 text-lg mb-5">{message}</p>}
        {error && <p className="text-red-400 text-lg mb-5">{error}</p>}

        {!loading && (
          <div className="w-full max-w-4xl space-y-6">
            {results.length === 0 ? (
              <p className="text-gray-400 text-center text-lg">No XSS vulnerabilities found.</p>
            ) : (
              results.map((result, index) => (
                <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-medium text-red-400">Vulnerability: {result.vulnerabilityType}</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-sm font-semibold ${
                        result.severity === 'High'
                          ? 'bg-red-500 text-white'
                          : result.severity === 'Medium'
                          ? 'bg-yellow-500 text-gray-800'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      {result.severity}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-2"><strong>Summary:</strong> {result.summary}</p>
                  <p className="text-gray-400 mb-2"><strong>Payload:</strong> <span className="text-sm bg-gray-700 p-1 rounded">{truncateText(result.payloadUsed, 50)}</span></p>
                  <button
                    onClick={() => toggleDetails(index)}
                    className="text-indigo-400 hover:text-indigo-300 text-sm font-medium focus:outline-none"
                  >
                    {expandedIndices.includes(index) ? '▲ Hide Details' : '▼ Show Details'}
                  </button>
                  {expandedIndices.includes(index) && (
                    <div className="mt-4 text-sm text-gray-300 bg-gray-700 p-4 rounded-md">
                      <strong>Details:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li><strong>URL:</strong> {truncateText(result.details.split(' with payload:')[0], 100)}</li>
                        <li><strong>Payload Used:</strong> {truncateText(result.payloadUsed, 50)}</li>
                        <li><strong>Response Snippet:</strong> {truncateText(result.details.split('Response contained reflected payload:')[1] || '', 100)}</li>
                      </ul>
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

export default XSSScanResultsPage;
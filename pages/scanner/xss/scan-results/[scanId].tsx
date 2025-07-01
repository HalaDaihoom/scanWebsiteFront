import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../../../Layout';
import Link from 'next/link';

interface ScanResult {
  severity: string;
  details: string;
  vulnerabilityType: string;
  payloadUsed: string;
}

interface ResultsResponse {
  message: string;
  results: { $values: ScanResult[] };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const XssScanResultsPage: React.FC = () => {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);
  const router = useRouter();
  const { scanId } = router.query;

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!scanId) {
          setError('Scan ID is missing.');
          setLoading(false);
          return;
        }

        const token = Cookies.get('token');
        if (!token) {
          setError('Authentication token is missing.');
          router.push('/login');
          return;
        }

        const response: AxiosResponse<ResultsResponse> = await axios.get(
          `${API_URL}/api/xss/scan-results/${scanId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const fetchedResults = response.data.results?.$values && Array.isArray(response.data.results.$values)
          ? response.data.results.$values
          : [];
        setResults(fetchedResults);
        setMessage(response.data.message || '');
      } catch (err: unknown) {
        console.error('Fetch results error:', err);
      
        if (
          typeof err === 'object' &&
          err !== null &&
          'response' in err &&
          typeof (err as any).response?.status === 'number'
        ) {
          const status = (err as any).response.status;
      
          if (status === 404) {
            setError('Scan not found. Please ensure the scan ID is valid.');
          } else if (status === 401) {
            setError('Unauthorized. Please log in again.');
            router.push('/login');
          } else {
            setError('Failed to load XSS scan results. Please try again later.');
          }
        } else {
          setError('An unexpected error occurred.');
        }
      }
       finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [scanId, router]);

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
      const { Confidence: confidence, Description: description } = parsedDetails;

      return (
        <ul className="text-sm text-gray-200 bg-gray-700 p-3 rounded-md mt-2 list-disc list-inside">
          {confidence && (
            <li>
              <span className="font-semibold text-green-400">Confidence:</span> {confidence}
            </li>
          )}
          {description && (
            <li className="mt-2">
              <span className="font-semibold text-gray-300">Description:</span>
              <ul className="list-[circle] list-inside ml-4">
                {description
                  .split('\n')
                  .map((line: string) => line.trim())
                  .filter((line: string) => line)
                  .map((line: string, idx: number) => (
                    <li key={idx} className="text-gray-200">
                      {line}
                    </li>
                  ))}
              </ul>
            </li>
          )}
        </ul>
      );
    } catch (err) {
      console.error('Failed to parse details:', err);
      return <div className="text-sm text-gray-200">Invalid details format.</div>;
    }
  };

  const getRemediationByType = () => {
    const remediationByType: { [key: string]: string[] } = {};

    results.forEach((result) => {
      try {
        const parsedDetails = JSON.parse(result.details || '{}');
        const vulnerabilityType = result.vulnerabilityType || 'Unknown';
        const solution = parsedDetails.Solution || '';

        if (solution && !remediationByType[vulnerabilityType]) {
          remediationByType[vulnerabilityType] = solution
            .split('\n')
            .map((line: string) => line.trim().replace(/\\n|\\t/g, ''))
            .filter((line: string) => line);
        }
      } catch (err) {
        console.error('Failed to parse remediation:', err);
      }
    });

    return remediationByType;
  };

  const remediationByType = getRemediationByType();

  const handleDownloadPdf = async () => {
    try {
      const token = Cookies.get('token');
      if (!token) {
        setError('Authentication token is missing.');
        return;
      }

      const response = await axios.get(`${API_URL}/api/xss/scan-results/${scanId}/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `XSS_Scan_Report_${scanId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }catch (err: unknown) {
      console.error('Download error:', err);
      setError('Failed to download PDF. Please try again later.');
    }
    
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
        <h1 className="text-4xl font-bold mb-6 text-indigo-400">XSS Scan Results Report</h1>
        <Link href="/scanner/xss/xss-scanner" className="text-indigo-400 hover:text-indigo-300 mb-5">
          Back to XSS Scanner
        </Link>
        <button
          onClick={handleDownloadPdf}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-5"
        >
          Download Report
        </button>
        {loading && <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading XSS reports...</p>}
        {message && <p className="text-green-400 text-lg mb-5">{message}</p>}
        {error && <p className="text-red-400 text-lg mb-5">{error}</p>}

        {!loading && (
          <div className="w-full max-w-4xl space-y-4">
            {/* Scan Summary */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-2xl">
              <h2 className="text-2xl font-bold text-indigo-400 mb-4">Scan Summary</h2>
              {results.length > 0 && (
                <p>
                  <span className="font-semibold">Website:</span>{' '}
                  {(() => {
                    try {
                      const { AffectedUrl } = JSON.parse(results[0].details);
                      const url = new URL(AffectedUrl);
                      return `${url.protocol}//${url.host}`;
                    } catch {
                      return 'N/A';
                    }
                  })()}
                </p>
              )}
              <p>
                <span className="font-semibold">Scan Date:</span>{' '}
                {new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
              <p>
                <span className="font-semibold">Total Vulnerabilities Found:</span> {results.length}
              </p>
            </div>

            {/* Vulnerability Findings */}
            <h2 className="text-2xl font-bold text-indigo-400 mt-8 mb-4">Vulnerability Findings</h2>
            {results.length === 0 ? (
              <p className="text-gray-400 text-center text-lg">No XSS vulnerabilities found.</p>
            ) : (
              Object.keys(
                results.reduce((acc: { [key: string]: boolean }, result) => {
                  acc[result.vulnerabilityType || 'Unknown'] = true;
                  return acc;
                }, {})
              ).map((vulnerabilityType) => (
                <div key={vulnerabilityType}>
                  <h3 className="text-xl font-semibold text-indigo-300 mb-4">{`${vulnerabilityType} Findings`}</h3>
                  {results
                    .filter((result) => result.vulnerabilityType === vulnerabilityType)
                    .map((result, index) => {
                      const globalIndex = results.findIndex((r) => r === result);
                      let affectedUrl = 'Unknown';
                      try {
                        const parsedDetails = JSON.parse(result.details || '{}');
                        affectedUrl = parsedDetails.AffectedUrl || 'Unknown';
                      } catch (err) {
                        console.error('Failed to parse AffectedUrl:', err);
                      }

                      return (
                        <div key={index} className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl mb-4">
                          <div className="mb-2">
                            <span className="text-lg font-semibold text-red-400">XSS Type:</span>
                            <span className="text-lg font-medium text-gray-300 ml-2">
                              {result.vulnerabilityType || 'Unknown XSS Type'}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-lg font-semibold text-indigo-400">Severity:</span>
                            <span
                              className={`text-lg font-medium ml-2 ${
                                result.severity?.toLowerCase() === 'high'
                                  ? 'text-red-400'
                                  : result.severity?.toLowerCase() === 'medium'
                                    ? 'text-yellow-400'
                                    : 'text-green-400'
                              }`}
                            >
                              {result.severity || 'Unknown'}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-lg font-semibold text-yellow-400">Payload:</span>
                            <span className="text-lg font-medium text-gray-300 ml-2">
                              {result.payloadUsed || 'None'}
                            </span>
                          </div>
                          <div className="mb-2">
                            <span className="text-lg font-semibold text-indigo-400">Affected URL:</span>
                            <span className="text-lg font-medium text-gray-300 ml-2">
                              <a
                                href={affectedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 underline"
                              >
                                {affectedUrl}
                              </a>
                            </span>
                          </div>
                          <button
                            onClick={() => toggleDetails(globalIndex)}
                            className="text-indigo-400 hover:text-indigo-300 focus:outline-none"
                          >
                            {expandedIndices.includes(globalIndex) ? '▲ Hide Details' : '▼ Show Details'}
                          </button>
                          {expandedIndices.includes(globalIndex) && (
                            <div className="mt-4">{formatDetails(result.details)}</div>
                          )}
                        </div>
                      );
                    })}
                  {/* Common Remediation */}
                  {remediationByType[vulnerabilityType] && (
                    <div className="bg-gray-800 p-6 rounded-lg shadow-2xl mt-4">
                      <h4 className="text-lg font-semibold text-green-400 mb-2">
                        Common Remediation for {vulnerabilityType}
                      </h4>
                      <ul className="list-disc list-inside text-sm text-gray-200">
                        {remediationByType[vulnerabilityType].map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
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

export default XssScanResultsPage;
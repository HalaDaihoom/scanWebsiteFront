import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ScanHistoryEntry {
  $id?: string;
  requestId: number;
  url: string;
  startedAt: string;
  zapScanId: number | null;
  vulnerabilityType: string | null;
}

interface ApiResponse {
  $id: string;
  $values: ScanHistoryEntry[];
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
          router.push('/login');
          return;
        }

        const response = await axios.get<ApiResponse>(
          `${API_URL}/api/scan-results`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setHistory(response.data.$values);
      } catch (err) {
        setError('Failed to load scan history. Please try again later.');
        console.error('Error fetching scan history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  // const getReportLink = (entry: ScanHistoryEntry) => {
  //   if (!entry.requestId) return null;

  //   switch (entry.vulnerabilityType?.toLowerCase()) {
  //     case 'sql injection':
  //       return `/scanner/sql-injection-results/${entry.requestId}`;
  //     case 'reflected xss':
  //     case 'stored xss':
  //       return `/scanner/xss/scan-results/${entry.requestId}`;
  //     default:
  //       // Redirect to automatic scan results page with query parameter
  //       return entry.vulnerabilityType == null ? `/scanner/scan-results?requestId=${entry.requestId}` : null;
  //   }
  // };
  const getReportLink = (entry: ScanHistoryEntry) => {
    if (!entry.requestId) return null;
  
    switch (entry.vulnerabilityType?.toLowerCase()) {
      case 'sql injection':
        return `/scanner/sql-injection-results/${entry.requestId}`;
      case 'reflected xss':
      case 'stored xss':
        return `/scanner/xss/scan-results/${entry.requestId}`;
      case 'subdomain takeover':
        return `/scanner/subdomain/subdomain-result`;
      default:
        return entry.vulnerabilityType == null
          ? `/scanner/scan-results?requestId=${entry.requestId}`
          : null;
    }
  };
  

  const getVulnerabilityBadge = (vulnerabilityType: string | null) => {
    if (!vulnerabilityType) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
          Automatic Scan
        </span>
      );
    }

    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";

    switch (vulnerabilityType.toLowerCase()) {
      case 'sql injection':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>SQL Injection</span>;
      case 'reflected xss':
      case 'stored xss':
        return <span className={`${baseClasses} bg-purple-100 text-purple-800`}>{vulnerabilityType}</span>;
      case 'subdomain takeover':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Subdomain Takeover</span>;
        
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>{vulnerabilityType}</span>;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white-800 mb-8">Scan History</h1>

        {history.length === 0 ? (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded">
            No scan history found.
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((entry) => {
              const reportLink = getReportLink(entry);
              return (
                <div
                  key={entry.requestId}
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">{entry.url}</h3>
                        {getVulnerabilityBadge(entry.vulnerabilityType)}
                      </div>
                      <p className="text-sm text-gray-500">
                        Scanned on: {new Date(entry.startedAt).toLocaleString()}
                      </p>
                    </div>

                    {reportLink ? (
                      <button
                        onClick={() => router.push(reportLink)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition-colors"
                      >
                        View Report
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Report not available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScanHistoryPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Layout from '../Layout';

// interface ScanHistoryEntry {
//   requestId: number; // ✅ Add this
//   url: string;
//   startedAt: string;
//   zapScanId: number | null;
// }


// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const ScanHistoryPage: React.FC = () => {
//   const [history, setHistory] = useState<ScanHistoryEntry[]>([]);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchHistory = async () => {
//       try {
//         const token = Cookies.get('token');
//         if (!token) {
//           setError('Authentication token is missing.');
//           router.push('/login');
//           return;
//         }

//         const response = await axios.get<{ $values: ScanHistoryEntry[] }>(
//           `${API_URL}/api/scan-results`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = response.data?.$values || [];
//         setHistory(data);
//       } catch (err) {
//         setError('Failed to load scan history. Please try again later.');
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHistory();
//   }, [router]);

//   return (
//     <Layout>
//       <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-gray-900 text-white">
//         <h1 className="text-4xl font-bold mb-6 text-indigo-400">Scan History</h1>

//         {loading && (
//           <p className="text-gray-400 mb-5 text-lg animate-pulse">Loading history...</p>
//         )}
//         {error && <p className="text-red-400 text-lg mb-5">{error}</p>}

//         {!loading && !error && history.length === 0 && (
//           <p className="text-gray-400 text-center text-lg">No scan history found.</p>
//         )}

//         {!loading && history.length > 0 && (
//           <div className="w-full max-w-4xl space-y-4">
//             {history.map((entry, index) => (
//               <div key={index} className="bg-gray-800 p-6 rounded-lg shadow-2xl">
//                 <div className="space-y-2">
//                   <p>
//                     <strong className="text-indigo-400">Website URL:</strong>{' '}
//                     <span className="text-gray-200">{entry.url}</span>
//                   </p>
//                   <p>
//                     <strong className="text-indigo-400">Scan Date:</strong>{' '}
//                     <span className="text-gray-200">
//                       {new Date(entry.startedAt).toLocaleString()}
//                     </span>
//                   </p>
//                   <a
//                     href={`/scanner/scan-results?requestId=${entry.requestId}`}
//                     className="text-indigo-400 hover:text-indigo-300 hover:underline"
//                   >
//                     View Report
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </Layout>
//   );
// };

// export default ScanHistoryPage;


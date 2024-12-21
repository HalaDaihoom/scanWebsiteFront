// import React, { useEffect, useState } from 'react';
// import axios, { AxiosResponse } from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// //import Layout from './../pages/Layout.tsx';

// interface ZapAlert {
//   Alert: string;
//   Risk: string;
//   Url: string;
//   Param: string;
//   Evidence: string;
//   Solution: string;
// }

// interface ScanResultsResponse {
//   Message: string;
//   Results: ZapAlert[];
// }

// const ScanResultsPage: React.FC = () => {
//   const [scanId, setScanId] = useState<string>('');
//   const [results, setResults] = useState<ZapAlert[] | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//     }
//   }, [router]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     event.preventDefault();
//     setLoading(true);
//     setResults(null);
//     setMessage(null);
//     setError(null);

//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//       setLoading(false);
//       return;
//     }

//     if (!scanId.trim()) {
//       setError('Please enter a valid Scan ID.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response: AxiosResponse<ScanResultsResponse> = await axios.get<ScanResultsResponse>(
//         `http://localhost:5000/api/scanners/automatic-scanner/scan-results/${scanId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(response.data.Message || 'Results fetched successfully!');
//       setResults(response.data.Results);
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         console.error('Axios error:', err.response);
//         if (err.response) {
//           if (err.response.status === 401) {
//             setError('Unauthorized. Redirecting to login.');
//             router.push('/login');
//           } else if (err.response.status === 500) {
//             setError('Internal server error. Please try again later.');
//           } else {
//             setError(err.response.data?.message || 'An error occurred.');
//           }
//         } else {
//           setError('Network error. Please check your connection.');
//         }
//       } else {
//         setError('An unexpected error occurred.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//    // <Layout>
//       <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
//         <h1 className="text-3xl mb-5">Scan Results</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
//           <label className="text-lg mb-2">
//             Scan ID:
//             <input
//               type="text"
//               value={scanId}
//               onChange={(e) => setScanId(e.target.value)}
//               className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
//               placeholder="Enter Scan ID"
//               required
//             />
//           </label>
//           <button
//             type="submit"
//             className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition"
//             disabled={loading}
//           >
//             {loading ? 'Fetching Results...' : 'Fetch Results'}
//           </button>
//         </form>

//         {/* Display messages */}
//         {message && <p className="text-green-500 mt-2">{message}</p>}
//         {error && <p className="text-red-500 mt-2">{error}</p>}

//         {/* Display Scan Results */}
//         {results && (
//           <div className="mt-6 w-full max-w-4xl bg-white p-5 rounded shadow-lg text-black">
//             <h2 className="text-xl font-semibold mb-4">Scan Alerts</h2>
//             <ul>
//               {results.map((alert, index) => (
//                 <li key={index} className="mb-4 border-b pb-2">
//                   <p><strong>Alert:</strong> {alert.Alert}</p>
//                   <p><strong>Risk:</strong> {alert.Risk}</p>
//                   <p><strong>URL:</strong> {alert.Url}</p>
//                   <p><strong>Param:</strong> {alert.Param}</p>
//                   <p><strong>Evidence:</strong> {alert.Evidence}</p>
//                   <p><strong>Solution:</strong> {alert.Solution}</p>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//       </main>
//    // </Layout>
//   );
// };

// export default ScanResultsPage;

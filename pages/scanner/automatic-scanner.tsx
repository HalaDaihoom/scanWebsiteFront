// import React, { useEffect, useState } from 'react';
// import axios, { AxiosResponse } from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Layout from '../Layout';

// interface ScanResponse {
//   Message?: string;
//   Results?: string;
// }

// const AutomaticScannerPage: React.FC = () => {
//   const [url, setUrl] = useState<string>('');
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

//   const isValidUrl = (inputUrl: string): boolean => {
//     const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
//     return urlPattern.test(inputUrl);
//   };

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     event.preventDefault();
//     setLoading(true);
//     setMessage(null);
//     setError(null);

//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//       setLoading(false);
//       return;
//     }

//     if (!url || !isValidUrl(url)) {
//       setError('Please enter a valid URL.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response: AxiosResponse<ScanResponse> = await axios.post<ScanResponse>(
//         'http://localhost:5000/api/scanners/automatic-scanner',
//         { url },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(response.data.Message || 'Scan completed successfully!');
//       console.log('Scan Results:', response.data.Results);

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
//     <Layout>
//       <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
//         <h1 className="text-3xl mb-5">Automatic Scanner</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
//           <label className="text-lg mb-2">
//             URL:
//             <input
//               type="text"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
//               placeholder="Enter URL"
//               required
//             />
//           </label>
//           <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition" disabled={loading}>
//             {loading ? 'Scanning...' : 'Scan'}
//           </button>
//         </form>
//         {message && <p className="text-green-500 mt-2">{message}</p>}
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </main>
//     </Layout>
//   );
// };

// export default AutomaticScannerPage;




// import React, { useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Layout from '../Layout';

// const AutomaticScannerPage: React.FC = () => {
//   const [url, setUrl] = useState<string>('');
//   const [scanId, setScanId] = useState<string | null>(null);
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const router = useRouter();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
//     event.preventDefault();
//     setError(null);
//     setMessage(null);
//     setScanId(null);
//     setLoading(true);

//     const token = Cookies.get('token');
//     if (!token) {
//       setError('You must be logged in.');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/scanners/automatic-scanner',
//         { url },
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       const { Message, scanId } = response.data;

//       if (scanId) {
//         setMessage(Message || 'Scan started successfully!');
//         setScanId(scanId);
//       } else {
//         setError('Scan started but no scanId was returned.');
//       }
//     } catch (error: any) {
//       console.error('Error starting scan:', error);
//       if (error.response?.status === 504) {
//         setError('The server took too long to respond. Please try again later.');
//       } else {
//         setError('Failed to start the scan. Please try again.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewResults = () => {
//     if (scanId) {
//       router.push(`/scanner/scan-result?scanId=${scanId}`);
//     }
//   };

//   return (
//     <Layout>
//       <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
//         <h1 className="text-3xl mb-5">Automatic Scanner</h1>
//         <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
//           <label className="text-lg mb-2">
//             URL:
//             <input
//               type="text"
//               value={url}
//               onChange={(e) => setUrl(e.target.value)}
//               className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
//               placeholder="Enter URL"
//               required
//             />
//           </label>
//           <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition" disabled={loading}>
//             {loading ? 'Scanning...' : 'Start Scan'}
//           </button>
//         </form>
//         {message && <p className="text-green-500 mt-2">{message}</p>}
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//         {scanId && (
//           <button
//             onClick={handleViewResults}
//             className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition"
//           >
//             View Scan Results
//           </button>
//         )}
//       </main>
//     </Layout>
//   );
// };

// export default AutomaticScannerPage;
























import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const AutomaticScannerPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [scanId, setScanId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setScanId(null);
    setLoading(true);

    const token = Cookies.get('token');
    if (!token) {
      setError('You must be logged in.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/scanners/automatic-scanner',
        { url },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { Message, scanId } = response.data;
      if (scanId) {
        setMessage(Message || 'Scan started successfully!');
        setScanId(scanId);  // Store scanId received from the API
      } else {
        setError('Scan started but no scanId was returned.');
      }
    } catch (error) {
      console.error('Error starting scan:', error);
      setError('Failed to start the scan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = () => {
    if (scanId) {
      // Redirect to ScanResults page and pass scanId as query parameter
      router.push(`/scanner/scan-result?scanId=${scanId}`);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Automatic Scanner</h1>
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
          <label className="text-lg mb-2">
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full text-black"
              placeholder="Enter URL"
              required
            />
          </label>
          <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition" disabled={loading}>
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
        </form>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
        {scanId && (
          <button
            onClick={handleViewResults}
            className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition"
          >
            View Scan Results
          </button>
        )}
      </main>
    </Layout>
  );
};

export default AutomaticScannerPage;

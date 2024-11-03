

import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout'; // Adjust the import based on your project structure

// Define the response structure for scan results
interface ScanResults {
  // Define properties based on what you expect from the scan results
  // For example:
  vulnerabilityFound: boolean;
  description: string;
  // Add more fields as necessary
}

interface ScanResponse {
  Message?: string;
  Results?: ScanResults; // Change from 'any' to 'ScanResults'
}

const AutomaticScannerPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    setLoading(true); // Start loading

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      setLoading(false); // End loading
      return;
    }

    if (!url) {
      setError('Please enter a valid URL.');
      setLoading(false); // End loading
      return;
    }

    try {
      const response: AxiosResponse<ScanResponse> = await axios.post<ScanResponse>(
        'http://localhost:5000/api/User/automatic-scanner',
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.Message || 'Scan completed!');
      console.log('Scan Results:', response.data.Results);
    } catch (err: unknown) {
      setLoading(false); // End loading
      if (axios.isAxiosError(err)) {
          console.error('Axios error:', err.response);
          if (err.response) {
              console.error('Response data:', err.response.data); // Log the response data
              if (err.response.status === 401) {
                  setError('Unauthorized. Redirecting to login.');
                  router.push('/login');
              } else if (err.response.status === 500) {
                  setError('Internal server error. Please try again later. Details: ' + JSON.stringify(err.response.data));
              } else {
                  setError(err.response.data?.message || 'An error occurred.');
              }
          } else {
              setError('Network error. Please check your connection.');
          }
      } else {
          setError('An unexpected error occurred.');
      }
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
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter URL"
              required // Ensuring the URL is required
            />
          </label>
          <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition" disabled={loading}>
            {loading ? 'Scanning...' : 'Scan'} {/* Loading feedback */}
          </button>
        </form>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </Layout>
  );
};

export default AutomaticScannerPage;




// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Layout from '../Layout'; // Adjust the import based on your project structure

// const AutomaticScannerPage = () => {
//   const [url, setUrl] = useState<string>('');
//   const [message, setMessage] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//     }
//   }, [router]);

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/User/automatic-scanner',
        
//         { url },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       setMessage(response.data.Message || 'Scan completed!');
//       console.log('Scan Results:', response.data.Results);
//     } catch (err: unknown) {
//       setError('Error submitting URL');
//       if (axios.isAxiosError(err) && err.response?.status === 401) {
//         router.push('/login');
//       }
//     }
// };


//   // const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//   //   event.preventDefault();

//   //   const token = Cookies.get('token');
//   //   if (!token) {
//   //     router.push('/login');
//   //     return;
//   //   }

//   //   try {
//   //     await axios.post(
//   //       'http://localhost:5000/api/User/automatic-scanner',
//   //       { url },
//   //       {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );
//   //     setMessage('URL submitted successfully!');
//   //     setUrl('');
//   //   } catch (err: unknown) {
//   //     setError('Error submitting URL');
//   //     if (axios.isAxiosError(err) && err.response?.status === 401) {
//   //       router.push('/login');
//   //     }
//   //   }
//   // };

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
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//               placeholder="Enter URL"
//             />
//           </label>
//           <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition">
//             Scan
//           </button>
//         </form>
//         {message && <p className="text-green-500 mt-2">{message}</p>}
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </main>
//     </Layout>
//   );
// };

// export default AutomaticScannerPage;

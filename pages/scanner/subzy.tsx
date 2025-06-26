import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const SubzyScanPage: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = Cookies.get('token');
    if (!token) {
      setError('You are not authorized.');
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/scan-test?domain=${domain}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Redirect to results page and pass data via query or sessionStorage
      // Because query params might be too big, we use sessionStorage here:
      sessionStorage.setItem('scanResult', JSON.stringify(response.data));

      router.push('/scanner/subzy-result');
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        setError(errorObj.response?.data?.message || 'Scan failed.');
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-6">Subdomain Takeover Scanner</h1>
        <form onSubmit={handleSubmit} className="bg-white text-black p-6 rounded shadow-lg w-full max-w-2xl">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. glitch.me)"
            className="w-full p-2 border border-gray-300 rounded mb-4"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-[#1A1A3D] text-white rounded flex items-center justify-center"
          >
            {loading ? 'Scanning...' : 'Start Scan'}
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </form>
      </main>
    </Layout>
  );
};

export default SubzyScanPage;


// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useRouter } from 'next/router';
// import Layout from '../Layout';

// const ScanPage: React.FC = () => {
//   const [domain, setDomain] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//     }
//   }, [router]);

//   const handleScan = async () => {
//     setLoading(true);
//     setError('');

//     try {
//       const token = Cookies.get('token');
//       if (!token) {
//         setError('User is not authenticated.');
//         setLoading(false);
//         return;
//       }

//       const res = await axios.get(
//         `http://localhost:5000/api/scan-test?domain=${encodeURIComponent(domain)}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );

//       // Save scan results to sessionStorage
//       sessionStorage.setItem('subzyScanResult', JSON.stringify(res.data));

//       // Redirect to results page
//       router.push('/scanner/subzy-result');
//     } catch (err: unknown) {
//       if (axios.isAxiosError(err)) {
//         setError(err.response?.data?.message || 'Something went wrong.');
//       } else {
//         setError('Something went wrong.');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Layout>
//       <div className="p-6 max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Subdomain Takeover Scanner</h1>

//         <input
//           type="text"
//           value={domain}
//           onChange={(e) => setDomain(e.target.value)}
//           placeholder="Enter domain (e.g. glitch.me)"
//           className="border p-2 rounded w-full mb-4"
//         />

//         <button
//           onClick={handleScan}
//           disabled={loading || !domain.trim()}
//           className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
//         >
//           {loading ? 'Scanning...' : 'Start Scan'}
//         </button>

//         {error && <p className="text-red-600 mt-4">{error}</p>}
//       </div>
//     </Layout>
//   );
// };

// export default ScanPage;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const AutomaticScannerPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const isValidUrl = (input: string): boolean => {
    const urlRegex = /^(https?:\/\/)[\w\-]+(\.[\w\-]+)+[/#?]?.*$/;
    return urlRegex.test(input);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com).');
      return;
    }

    setLoading(true);
    const token = Cookies.get('token');
    if (!token) {
      setLoading(false);
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/scan-requests`,
        { url },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { redirectUrl } = response.data;
      if (redirectUrl) {
        const correctedUrl = redirectUrl.replace('/scan-result', '/scan-results');
        router.push(correctedUrl);
      } else {
        setError('Redirect URL is missing in the response.');
      }
    } catch (err: unknown) {
      let errorMessage = 'An error occurred during the scan submission.';
    
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as any).response === 'object'
      ) {
        const response = (err as any).response;
        errorMessage =
          response?.data?.Results?.[0]?.Details ||
          response?.data?.Message ||
          errorMessage;
      }
    
      setError(errorMessage);
    }
     finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <main className="flex flex-col lg:flex-row min-h-screen bg-gray-900 text-white">
        {/* Left Section - Info */}
        <section className="lg:w-1/2 p-10 flex flex-col justify-center bg-gray-800 border-r border-gray-700">
        <h1 className="text-4xl font-bold text-indigo-400 mb-6">Automatic Vulnerability Scanner</h1>
<p className="text-lg mb-4">
  This tool uses <strong>OWASP ZAP</strong>, a powerful security scanner, to detect vulnerabilities in your website automatically.
</p>
<p className="text-lg mb-4">
  Once you enter a URL, the system will:
</p>
<ul className="list-disc list-inside text-lg mb-4 space-y-1">
  <li>Start scanning your website in the background</li>
  <li>Perform both crawling (spidering) and active attack simulations</li>
  <li>Store the scan results securely</li>
  <li>Generate a full vulnerability report</li>
</ul>
<p className="text-lg mb-4">
  <strong>AI-Powered Summary:</strong> After scanning, our AI will analyze the technical results and generate a simple, human-friendly summary of the threats, severity levels, and recommended fixes.
</p>
<p className="text-sm italic text-gray-400 mt-2">
  Note: Only scan websites you own or have explicit permission to test.
</p>
        </section>

        {/* Right Section - Form */}
        <section className="lg:w-1/2 p-10 flex flex-col items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg"
          >
            <label className="text-lg mb-4">
              Website URL:
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-2 p-3 w-full bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., https://example.com"
                required
              />
            </label>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-500"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin mr-2 h-5 w-5 border-2 border-t-transparent border-white rounded-full"></div>
                  Scanning...
                </span>
              ) : (
                'Start Scan'
              )}
            </button>
            {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
          </form>
        </section>
      </main>
    </Layout>
  );
};

export default AutomaticScannerPage;


// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Layout from '../Layout';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const AutomaticScannerPage: React.FC = () => {
//   const [url, setUrl] = useState('');
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const token = Cookies.get('token');
//     if (!token) {
//       router.push('/login');
//     }
//   }, [router]);

//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
//     setLoading(true);
//     setError(null);

//     const token = Cookies.get('token');
//     if (!token) {
//       setLoading(false);
//       router.push('/login');
//       return;
//     }
//     console.log("API_URL:", API_URL);


//     try {
//       const response = await axios.post(
//         //`${API_URL}api/scanners/automatic-scanner/scan-requests`,
//         `${API_URL}/api/scan-requests`,
//         { url },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const { redirectUrl } = response.data;
//       console.log('Response:', response.data);

//       if (redirectUrl) {
//         const correctedUrl = redirectUrl.replace('/scan-result', '/scan-results');
//         router.push(correctedUrl);
//       }
//        else {
//         setError('Redirect URL is missing in the response.');
//       }
//     } catch (err) {
//       setError('An error occurred during scan submission.');
//       console.error(err);
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
//               className="mt-1 p-2 border border-gray-300 rounded w-full"
//               placeholder="Enter URL"
//               required
//             />
//           </label>
//           <button
//             type="submit"
//             className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded flex items-center justify-center"
//             disabled={loading}
//           >
//             {loading && (
//               <div className="loader mr-2">
//                 <div className="circle"></div>
//               </div>
//             )}
//             {loading ? 'Calm down Johnny...' : 'Scan'}
//           </button>
//         </form>
//         {error && <p className="text-red-500 mt-2">{error}</p>}
//       </main>

//       {/* CSS for the spinner */}
//       <style jsx>{`
//         .loader {
//           display: inline-block;
//           width: 1rem;
//           height: 1rem;
//           border: 2px solid transparent;
//           border-top: 2px solid white;
//           border-radius: 50%;
//           animation: spin 1s linear infinite;
//         }

//         @keyframes spin {
//           from {
//             transform: rotate(0deg);
//           }
//           to {
//             transform: rotate(360deg);
//           }
//         }
//       `}</style>
//     </Layout>
//   );
// };

// export default AutomaticScannerPage;



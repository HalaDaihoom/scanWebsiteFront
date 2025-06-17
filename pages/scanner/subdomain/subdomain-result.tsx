import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../Layout';
import Cookies from 'js-cookie';

const ScanResult = () => {
  const router = useRouter();
  const { scanId } = router.query;

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      const token = Cookies.get('token');

      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://scan-website.runasp.net/api/scan-subdomain-list', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        const extracted = data.$values || [];

        setResults(extracted);
        if (extracted.length > 0 && extracted[0].subdomain) {
          const firstSub = extracted[0].subdomain;
          const parts = firstSub.replace('*.', '').split('.');
          setDomain(parts.slice(-2).join('.')); // extract root domain
        }

      } 
      /* eslint-disable @typescript-eslint/no-explicit-any */

      catch (err: any) {
        setError(err.message || 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [router]);

  const handleDownloadReport = async () => {
    const token = Cookies.get('token');
    if (!token || !domain) return;

    try {
      const response = await fetch('http://scan-website.runasp.net/api/report/domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(domain),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `subdomain-report-${domain}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed. Please try again.');
    }
  };

  return (
    <Layout>
      <main className="p-10 text-white bg-[#0A0A23] min-h-screen">
        <h1 className="text-3xl mb-6">Subdomain Scan Results</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {results.length > 0 && (
          <>
            <button
              onClick={handleDownloadReport}
              className="mb-6 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Download Full PDF Report
            </button>

            {results.map((r, index) => (
              <div key={index} className="bg-white text-black p-6 rounded shadow mb-4">
                <p><strong>Result ID:</strong> {r.resultId}</p>
                <p><strong>Subdomain:</strong> {r.subdomain}</p>
                <p><strong>Severity:</strong> {r.severity || 'None'}</p>
                <p><strong>Summary:</strong> {r.summary}</p>
                <p><strong>Details:</strong> {r.details}</p>
                <p><strong>Vulnerability Type:</strong> {r.vulnerabilityType}</p>
              </div>
            ))}
          </>
        )}
      </main>
    </Layout>
  );
};

export default ScanResult;


// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../../Layout';
// import Cookies from 'js-cookie';

// const ScanResult = () => {
//   const router = useRouter();
//   const { scanId } = router.query;

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [result, setResult] = useState<any>(null);

//   useEffect(() => {
//     const fetchResult = async () => {
//       const token = Cookies.get('token');

//       if (!token) {
//         router.push('/login');
//         return;
//       }

//       if (!scanId) return;

//       try {
//         const response = await fetch('http://scan-website.runasp.net/api/scan-subdomain-list', {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData.message || 'Failed to fetch scan result');
//         }

//         const data = await response.json();
//         setResult(data);
//       } catch (err: any) {
//         setError(err.message || 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResult();
//   }, [scanId, router]);

//   return (
//     <Layout>
//       <main className="p-10 text-white bg-[#0A0A23] min-h-screen">
//         <h1 className="text-3xl mb-6">Scan Result</h1>
//         {loading && <p>Loading...</p>}
//         {error && <p className="text-red-500">{error}</p>}
//         {result && (
//           <div className="bg-white text-black p-6 rounded shadow">
//             <p><strong>Scan ID:</strong> {result.scanId}</p>
//             <p><strong>Subdomain:</strong> {result.subdomain}</p>
//             <p><strong>Vulnerable:</strong> {result.vulnerable ? 'Yes' : 'No'}</p>
//             <p><strong>Severity:</strong> {result.severity}</p>
//             <p><strong>Summary:</strong> {result.summary}</p>
//             <p><strong>Details:</strong> {result.details}</p>
//           </div>
//         )}
//       </main>
//     </Layout>
//   );
// };

// export default ScanResult;

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout';

interface SubdomainItem {
  subdomain: string;
  resolves: boolean;
  ipAddress: string;
  source: string;
}

interface ScanResult {
  domain: string;
  total: number;
  subdomains: SubdomainItem[];
}

const SubdomainFinderResultPage: React.FC = () => {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [downloading, setDownloading] = useState(false);
  const router = useRouter();
  const { domain } = router.query;

  useEffect(() => {
    if (!domain || typeof domain !== 'string') return;

    const fetchResult = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subdomains`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ domain }),
        });

        const raw = await response.json();
        const subdomains = raw.subdomains?.$values || raw.subdomains || [];

        setResult({
          domain: raw.domain,
          total: raw.total,
          subdomains,
        });
      } catch {
        router.push('/scanner/subdomain-finder');
      }
    };

    fetchResult();
  }, [domain, router]);

  const handleDownload = async () => {
    if (!domain || typeof domain !== 'string') return;

    try {
      setDownloading(true);
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subdomain-reports/${encodeURIComponent(domain)}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn('Download request failed.');
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subdomain-report-${domain.replace(/\W+/g, '_')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Download error:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (!result) {
    return (
      <Layout>
        <div className="p-8 text-white">Loading scan results...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen p-8 bg-[#0A0A23] text-white">
        <h1 className="text-3xl font-bold mb-2 text-indigo-400">
          Subdomain Report for <span className="text-white">{result.domain}</span>
        </h1>
        <p className="text-sm mb-6 text-gray-300">
          Total subdomains found: <span className="text-white font-semibold">{result.total}</span>
        </p>

        <button
          onClick={handleDownload}
          className="mb-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          disabled={downloading}
        >
          {downloading ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
              Downloading...
            </span>
          ) : (
            ' Download PDF Report'
          )}
        </button>

        <div className="overflow-x-auto rounded shadow border border-gray-700">
          <table className="w-full text-sm bg-white text-black rounded">
            <thead className="bg-gray-200 text-gray-800">
              <tr>
                <th className="p-3 border border-gray-300">Subdomain</th>
                <th className="p-3 border border-gray-300">Resolves</th>
                <th className="p-3 border border-gray-300">IP Address</th>
                <th className="p-3 border border-gray-300">Source</th>
              </tr>
            </thead>
            <tbody>
              {result.subdomains.map((r, i) => (
                <tr key={i} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-300">{r.subdomain}</td>
                  <td className="p-3 border border-gray-300">{r.resolves ? 'Yes' : 'No'}</td>
                  <td className="p-3 border border-gray-300">{r.ipAddress || '-'}</td>
                  <td className="p-3 border border-gray-300">{r.source || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
};

export default SubdomainFinderResultPage;

// // pages/scanner/subdomain-finder-result.tsx
// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Cookies from 'js-cookie';
// import Layout from '../Layout';

// interface SubdomainItem {
//   subdomain: string;
//   resolves: boolean;
//   ipAddress: string;
//   source: string;
// }

// interface ScanResult {
//   domain: string;
//   total: number;
//   subdomains: SubdomainItem[];
// }

// const SubdomainFinderResultPage: React.FC = () => {
//   const [result, setResult] = useState<ScanResult | null>(null);
//   const router = useRouter();
//   const { domain } = router.query;

//   useEffect(() => {
//     if (!domain || typeof domain !== 'string') return;

//     const fetchResult = async () => {
//       try {
//         const token = Cookies.get('token');
//         const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subdomains`, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ domain }),
//         });

//         const raw = await response.json();
//         const subdomains = raw.subdomains?.$values || [];

//         setResult({
//           domain: raw.domain,
//           total: raw.total,
//           subdomains,
//         });
//       } catch {
//         router.push('/scanner/subdomain-finder');
//       }
//     };

//     fetchResult();
//   }, [domain, router]);

//   const [downloading, setDownloading] = useState(false);

// const handleDownload = async () => {
//   if (!domain || typeof domain !== 'string') return;

//   try {
//     setDownloading(true);
//     const token = Cookies.get('token');
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subdomain-reports/${encodeURIComponent(domain)}`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!res.ok) {
//       console.warn('Download triggered, but CORS prevented full access.');
//       return; // don’t show alert
//     }
    
//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = `subdomain-report-${domain.replace(/\W+/g, '_')}.pdf`;
//     link.click();
//     window.URL.revokeObjectURL(url);
//   }  catch (error: unknown) {
//     console.warn('PDF download might have succeeded, but CORS blocked fetch access.', error);
    
//     if (error instanceof TypeError) {
//       // Likely a CORS issue or network error
//       console.log('TypeError caught, likely CORS-related.');
//     } else {
//       alert('Failed to download PDF report.');
//     }
//   }
//   finally {
//     setDownloading(false);
//   }
// };


  

//   if (!result) {
//     return (
//       <Layout>
//         <p className="text-white p-6">Loading...</p>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <main className="min-h-screen p-8 bg-[#0A0A23] text-white">
//         <h1 className="text-2xl font-bold mb-4">Subdomain Results for: {result.domain}</h1>
//         <p>Total: {result.total}</p>

//         <button
//   onClick={handleDownload}
//   className="mt-4 mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//   disabled={downloading}
// >
//   {downloading ? (
//     <span className="flex items-center justify-center">
//       <div className="animate-spin mr-2 h-4 w-4 border-2 border-t-transparent border-white rounded-full" />
//       Downloading...
//     </span>
//   ) : (
//     'Download PDF Report'
//   )}
// </button>


//         <table className="w-full bg-white text-black mt-6 text-sm rounded shadow">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border">Subdomain</th>
//               <th className="p-2 border">Resolves</th>
//               <th className="p-2 border">IP</th>
//               <th className="p-2 border">Source</th>
//             </tr>
//           </thead>
//           <tbody>
//             {result.subdomains.map((r, i) => (
//               <tr key={i}>
//                 <td className="p-2 border">{r.subdomain}</td>
//                 <td className="p-2 border">{r.resolves ? 'Yes' : 'No'}</td>
//                 <td className="p-2 border">{r.ipAddress || '-'}</td>
//                 <td className="p-2 border">{r.source || '-'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>
//     </Layout>
//   );
// };

// export default SubdomainFinderResultPage;

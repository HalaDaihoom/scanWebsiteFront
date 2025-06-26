import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../Layout';

interface ScanResult {
  domain: string;
  total_scanned: number;
  vulnerable_count: number;
  results: {
    subdomain: string;
    isVulnerable: boolean;
    httpStatus: number;
    error?: string;
  }[];
}

const SubzyResultPage: React.FC = () => {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedResult = sessionStorage.getItem('scanResult');
    if (!storedResult) {
      // No data, redirect back to scan page
      router.push('/scanner/subzy');
      return;
    }
    setScanResult(JSON.parse(storedResult));
  }, [router]);

  if (!scanResult) {
    return (
      <Layout>
        <p className="p-6 text-center text-white">Loading results...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-6">Scan Results for {scanResult.domain}</h1>
        <p>Total scanned: {scanResult.total_scanned}</p>
        <p>Vulnerable count: {scanResult.vulnerable_count}</p>

        <div className="overflow-auto w-full max-w-4xl mt-6 bg-white text-black rounded shadow">
          <table className="w-full border text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2 border">Subdomain</th>
                <th className="p-2 border">Vulnerable</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Error</th>
              </tr>
            </thead>
            <tbody>
              {scanResult.results.map((r, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{r.subdomain}</td>
                  <td className={`p-2 border ${r.isVulnerable ? 'text-red-600 font-bold' : 'text-green-600'}`}>
                    {r.isVulnerable ? 'Yes' : 'No'}
                  </td>
                  <td className="p-2 border">{r.httpStatus}</td>
                  <td className="p-2 border">{r.error || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </Layout>
  );
};

export default SubzyResultPage;


// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../Layout';

// type ResultType = {
//   subdomain: string;
//   isVulnerable: boolean;
//   httpStatus: number;
//   error?: string | null;
// };

// type ScanResultData = {
//   domain: string;
//   total_scanned: number;
//   vulnerable_count: number;
//   results: ResultType[];
// };

// const SubzyResultPage: React.FC = () => {
//   const [data, setData] = useState<ScanResultData | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const stored = sessionStorage.getItem('subzyScanResult');
//     if (!stored) {
//       router.push('/scanner/subzy'); // Redirect if no result found
//       return;
//     }

//     const parsed = JSON.parse(stored);

//     // Handle possible .NET serialization format with $values
//     const resultsArray = Array.isArray(parsed.results)
//       ? parsed.results
//       : parsed.results?.$values || [];

//     setData({ ...parsed, results: resultsArray });
//   }, [router]);

//   const clearResults = () => {
//     sessionStorage.removeItem('subzyScanResult');
//     setData(null);
//     router.push('/scanner/subzy'); // Redirect back to scan page after clearing
//   };

//   if (!data) return null;

//   return (
//     <Layout>
//       <main className="min-h-screen bg-white p-6 max-w-4xl mx-auto">
//         <h1 className="text-2xl font-bold mb-4">Results for: {data.domain}</h1>
//         <p>Total scanned: {data.total_scanned}</p>
//         <p>Vulnerable count: {data.vulnerable_count}</p>

//         <button
//           onClick={clearResults}
//           className="mb-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//         >
//           Clear Results
//         </button>

//         <table className="w-full mt-6 border text-sm border-collapse border-gray-300">
//           <thead className="bg-gray-200">
//             <tr>
//               <th className="p-2 border" scope="col">Subdomain</th>
//               <th className="p-2 border" scope="col">Vulnerable</th>
//               <th className="p-2 border" scope="col">Status</th>
//               <th className="p-2 border" scope="col">Error</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.results.map((r, i) => (
//               <tr key={i}>
//                 <td className="border p-2">{r.subdomain}</td>
//                 <td className={`border p-2 ${r.isVulnerable ? 'text-red-600 font-semibold' : 'text-green-600'}`}>
//                   {r.isVulnerable ? 'Yes' : 'No'}
//                 </td>
//                 <td className="border p-2">{r.httpStatus}</td>
//                 <td className="border p-2">{r.error || '-'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </main>
//     </Layout>
//   );
// };

// export default SubzyResultPage;

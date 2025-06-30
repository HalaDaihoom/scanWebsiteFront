import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Layout from '../../Layout';
import { useRouter } from 'next/router';

interface ResultItem {
  severity: string;
  status: string;
  detail: string;
}

export default function SubdomainResult() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<ResultItem[]>([]);
  const [metaInfo, setMetaInfo] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedDomain = sessionStorage.getItem('domain');
    const storedRaw = sessionStorage.getItem('subzyResults');

    if (storedDomain && storedRaw) {
      setDomain(storedDomain);
      const lines = JSON.parse(storedRaw) as string[];

      const metadata: string[] = [];
      const parsed: ResultItem[] = [];

      const uniqueLines = Array.from(new Set(lines));

      uniqueLines.forEach(line => {
        const lowered = line.toLowerCase();

        if (!line.includes('.')) {
          metadata.push(line); // metadata line
          return;
        }

        let status = ' Unknown';
        if (lowered.includes('not vulnerable')) status = ' Not Vulnerable';
        else if (lowered.includes('vulnerable')) status = ' Vulnerable';
        else if (lowered.includes('http error')) status = ' HTTP Error';

        let severity = 'Info';
        if (lowered.includes('not vulnerable')) severity = 'Secured';
        else if (lowered.includes('vulnerable')) severity = 'High';
        else if (lowered.includes('http error')) severity = 'Unknown';

        parsed.push({ severity, status, detail: line });
      });

      setMetaInfo(metadata);
      setResults(parsed);
    }
  }, []);

  const handleDownload = async () => {
    const token = Cookies.get('token');
    if (!domain) return alert('No domain found.');

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/takeover-reports/${domain}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return alert('Failed to download report.');

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subzy-report-${domain}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const getRowColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'low':
        return 'bg-yellow-100 text-yellow-700';
      case 'info':
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-indigo-500">
          Scan Results for <span className="text-white">{domain}</span>
        </h1>
        <div className="flex justify-between items-center mt-8">
          
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
             Download PDF Report
          </button>
        </div>
        {metaInfo.length > 0 && (
          <div className="mb-6 bg-gray-800 rounded p-4 border border-gray-700">
            <h2 className="text-lg font-semibold text-indigo-400 mb-2">Scanner Configuration</h2>
            <ul className="list-disc list-inside text-sm text-gray-200 space-y-1">
              {metaInfo.map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          </div>
        )}

        {results.length === 0 ? (
          <p className="text-white">No results found.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full table-auto border-collapse border border-gray-600">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="p-3 border border-gray-600">Severity</th>
                  <th className="p-3 border border-gray-600">Status</th>
                  <th className="p-3 border border-gray-600 text-left">Details</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, index) => (
                  <tr key={index} className={getRowColor(item.severity)}>
                    <td className="p-2 border border-gray-600 text-center">{item.severity}</td>
                    <td className="p-2 border border-gray-600 text-center">{item.status}</td>
                    <td className="p-2 border border-gray-600">{item.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* <div className="flex justify-between items-center mt-8">
          
          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
             Download PDF Report
          </button>
        </div> */}
      </div>
    </Layout>
  );
}


// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';
// import { useRouter } from 'next/router';
// import Layout from '../../Layout';


// export default function SubdomainResult() {
//   const [domain, setDomain] = useState('');
//   const [results, setResults] = useState<string[]>([]);

//   useEffect(() => {
//     const storedDomain = sessionStorage.getItem('domain');
//     const storedResults = sessionStorage.getItem('subzyResults');
//     if (storedDomain && storedResults) {
//       setDomain(storedDomain);
//       setResults(JSON.parse(storedResults));
//     }
//   }, []);

//   const handleDownload = async () => {
//     const token = Cookies.get('token');
//     const res = await fetch('https://8e30-156-209-31-59.ngrok-free.app/api/report/subzy', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify({ domain }),
//     });

//     if (!res.ok) return alert('Failed to download report');

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `subzy-report-${domain}.pdf`;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//     window.URL.revokeObjectURL(url);
//   };

//   return (
//     <Layout>
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Results for {domain}</h1>
//       <ul className="list-disc pl-6">
//         {results.map((line, i) => (
//           <li key={i}>{line}</li>
//         ))}
//       </ul>
//       <button
//         onClick={handleDownload}
//         className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
//       >
//         Download PDF Report
//       </button>
//     </div>
//     </Layout>
//   );
// }

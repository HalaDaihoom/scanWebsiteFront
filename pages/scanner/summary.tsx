import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../Layout';
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const parseSections = (text: string) => {
  const sections = text.split(/\n(?=\*\*\d+\.\s)/); // Match **1. Title**
  return sections.map((section, index) => {
    const lines = section.split('\n');
    const title = lines[0].replace(/\*\*/g, '').trim();
    const content = lines.slice(1).join('\n').trim();
    return { title, content };
  });
};

const SummaryPage = () => {
  const router = useRouter();
  const { scanId } = router.query;

  const [summary, setSummary] = useState('');
  const [sections, setSections] = useState<{ title: string; content: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<number | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!scanId) return;

      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/api/summary?scanId=${scanId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = response.data.summary;
        setSummary(raw);
        setSections(parseSections(raw));
      } catch (err: any) {
        setError('Failed to load or generate summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [scanId]);

  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">Scan Summary</h1>

          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && sections.length > 0 && (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="border border-gray-600 rounded-lg">
                  <button
                    onClick={() =>
                      setOpenSection(openSection === index ? null : index)
                    }
                    className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 font-semibold text-lg rounded-t-lg"
                  >
                    {section.title}
                  </button>
                  {openSection === index && (
                    <div className="px-4 py-3 bg-gray-900 whitespace-pre-wrap text-gray-200 rounded-b-lg">
                      {section.content}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && !summary && (
            <p className="text-gray-400 text-center">No summary available.</p>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SummaryPage;


// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/router';
// import Layout from '../Layout'; // Adjust path if needed
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// const SummaryPage = () => {
//   const router = useRouter();
//   const { scanId } = router.query;

//   const [summary, setSummary] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSummary = async () => {
//       if (!scanId) return;

//       try {
//         const token = Cookies.get('token');
//         if (!token) {
//           router.push('/login');
//           return;
//         }

//         // Try to fetch the summary
//         const response = await axios.get(`${API_URL}/api/summary?scanId=${scanId}`, {

//           headers: { Authorization: `Bearer ${token} `},
//         });

//         setSummary(response.data.summary);
//       } catch (err: any) {
//         if (err.response?.status === 404) {
//           // Summary not found, try to generate
//           try {
//             const generate = await axios.post(
//               `${API_URL}/api/summarize-scan-results`,
//               { scanId: Number(scanId) },
//               {
//                 headers: { Authorization: `Bearer ${Cookies.get('token')} `},
//               }
//             );

//             // ✅ Set directly after generation
//             setSummary(generate.data.Summary);
//           } catch (genErr) {
//             console.error('Failed to generate summary:', genErr);
//             setError('Failed to generate summary.');
//           }
//         } else {
//           console.error('Failed to fetch summary:', err);
//           setError('Failed to load summary.');
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSummary();
//   }, [scanId]);

//   return (
//     <Layout>
//       <main className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
//         <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-2xl w-full">
//           <h1 className="text-3xl font-bold text-indigo-400 mb-4">Scan Summary</h1>

//           {loading && <p className="text-gray-400">Loading...</p>}
//           {error && <p className="text-red-400">{error}</p>}
//           {!loading && !error && summary && (
//             <pre className="whitespace-pre-wrap text-gray-200">{summary}</pre>
//           )}
//           {!loading && !error && !summary && (
//             <p className="text-gray-400">No summary available.</p>
//           )}
//         </div>
//       </main>
//     </Layout>
//   );
// };

// export default SummaryPage;
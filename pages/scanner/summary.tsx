import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../Layout';
import axios from 'axios';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface TableRow {
  Title: string;
  'Port/Protocol': string;
  'URL Evidence': string;
  'Risk Description': string;
  Recommendation: string;
  References: string;
  'CWE ID': string;
  'OWASP Top 10 (2017)': string;
  'OWASP Top 10 (2021)': string;
  Status: string;
}

interface Section {
  title: string;
  content: string | TableRow[];
  isTable?: boolean;
  intro?: string; // New field for introductory text
}

const parseSections = (text: string): Section[] => {
  const sections = text.split(/\n(?=\*\*\d+\.\s)/).map(section => section.trim()).filter(section => section);
  return sections.map(section => {
    const lines = section.split('\n');
    const title = lines[0].replace(/\*\*/g, '').trim();
    const contentLines = lines.slice(1).filter(line => line.trim());

    let intro = '';
    let tableLines: string[] = [];

    // Separate intro text from table
    let isTableSection = false;
    for (let line of contentLines) {
      if (line.trim().startsWith('|')) {
        isTableSection = true;
      }
      if (isTableSection) {
        tableLines.push(line);
      } else {
        intro += line + '\n';
      }
    }

    if (tableLines.length > 0 && tableLines[0].startsWith('|')) {
      const headers = tableLines[0].split('|').map(h => h.trim()).filter(h => h);
      const rows = tableLines.slice(2).filter(row => row.trim().startsWith('|')).map(row => {
        const values = row.split('|').map(v => v.trim()).filter(v => v);
        const rowObj: Partial<TableRow> = {};
        headers.forEach((header, index) => {
          rowObj[header as keyof TableRow] = values[index] || '';
        });
        return rowObj as TableRow;
      });
      return { title, content: rows, isTable: true, intro: intro.trim() };
    }

    const content = intro || contentLines.join('\n');
    return { title, content };
  });
};

const SummaryPage = () => {
  const router = useRouter();
  const { requestId } = router.query;
  const [sections, setSections] = useState<Section[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState<number | null>(null);

  useEffect(() => {
    if (!router.isReady || !requestId) return;
    const fetchSummary = async () => {
      try {
        const token = Cookies.get('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get(`${API_URL}/api/summary?requestId=${requestId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const raw = response.data.summary;
        setSections(parseSections(raw));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load or generate summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [router.isReady, requestId]);

  const renderContent = (content: string | TableRow[], isTable?: boolean, intro?: string) => {
    if (isTable && Array.isArray(content)) {
      return (
        <div>
          {intro && <ReactMarkdown className="space-y-2 text-gray-200 mb-4">{intro}</ReactMarkdown>}
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700 sticky top-0">
                  {Object.keys(content[0]).map((header, index) => (
                    <th key={index} className="px-4 py-2 border-b border-gray-600 font-semibold text-indigo-400">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.map((row, index) => (
                  <tr key={index} className="border-b border-gray-600 hover:bg-gray-800">
                    {Object.values(row).map((value, i) => (
                      <td key={i} className="px-4 py-2 break-words">
                        {i === 2 || i === 5 ? (
                          value.split(', ').map((item: string, j: number) => (
                            <a
                              key={j}
                              href={item}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 underline block"
                            >
                              {item}
                            </a>
                          ))
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return <ReactMarkdown className="space-y-2 text-gray-200">{content as string}</ReactMarkdown>;
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gray-900 text-white px-4 py-10 flex flex-col items-center">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-4xl w-full">
          <h1 className="text-3xl font-bold text-indigo-400 mb-6 text-center">Scan Summary</h1>

          {loading && (
            <p className="text-gray-400 flex items-center justify-center">
              <span className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></span>
              Loading...
            </p>
          )}
          {error && <p className="text-red-400 text-center">{error}</p>}

          {!loading && !error && sections.length > 0 && (
            <div className="space-y-4">
              {sections.map((section, index) => (
                <div key={index} className="border border-gray-600 rounded-lg">
                  <button
                    onClick={() => setOpenSection(openSection === index ? null : index)}
                    className="w-full text-left px-4 py-3 bg-gray-700 hover:bg-gray-600 font-semibold text-lg rounded-t-lg"
                  >
                    {section.title}
                  </button>
                  {openSection === index && (
                    <div className="px-4 py-3 bg-gray-900 rounded-b-lg">
                      {renderContent(section.content, section.isTable, section.intro)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {!loading && !error && sections.length === 0 && (
            <p className="text-gray-400 text-center">No summary available.</p>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SummaryPage;
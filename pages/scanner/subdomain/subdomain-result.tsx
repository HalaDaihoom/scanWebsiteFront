import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Layout from '../../Layout';


export default function SubdomainResult() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<string[]>([]);

  useEffect(() => {
    const storedDomain = sessionStorage.getItem('domain');
    const storedResults = sessionStorage.getItem('subzyResults');
    if (storedDomain && storedResults) {
      setDomain(storedDomain);
      setResults(JSON.parse(storedResults));
    }
  }, []);

  const handleDownload = async () => {
    const token = Cookies.get('token');
    const res = await fetch('https://8e30-156-209-31-59.ngrok-free.app/api/report/subzy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ domain }),
    });

    if (!res.ok) return alert('Failed to download report');

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

  return (
    <Layout>
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Results for {domain}</h1>
      <ul className="list-disc pl-6">
        {results.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ul>
      <button
        onClick={handleDownload}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Download PDF Report
      </button>
    </div>
    </Layout>
  );
}

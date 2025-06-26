// pages/scanner/subdomain-finder-result.tsx
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
  const router = useRouter();
  const { domain } = router.query;

  useEffect(() => {
    if (!domain || typeof domain !== 'string') return;

    const fetchResult = async () => {
      try {
        const token = Cookies.get('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subdomains-with-sources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ domain }),
        });

        const raw = await response.json();
        const subdomains = raw.subdomains?.$values || [];

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
      const token = Cookies.get('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/report/subdomain-finder`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ domain }),
      });

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `subdomain-report-${domain.replace(/\W+/g, '_')}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download PDF report.');
    }
  };

  if (!result) {
    return (
      <Layout>
        <p className="text-white p-6">Loading...</p>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="min-h-screen p-8 bg-[#0A0A23] text-white">
        <h1 className="text-2xl font-bold mb-4">Subdomain Results for: {result.domain}</h1>
        <p>Total: {result.total}</p>

        <button
          onClick={handleDownload}
          className="mt-4 mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Download PDF Report
        </button>

        <table className="w-full bg-white text-black mt-6 text-sm rounded shadow">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Subdomain</th>
              <th className="p-2 border">Resolves</th>
              <th className="p-2 border">IP</th>
              <th className="p-2 border">Source</th>
            </tr>
          </thead>
          <tbody>
            {result.subdomains.map((r, i) => (
              <tr key={i}>
                <td className="p-2 border">{r.subdomain}</td>
                <td className="p-2 border">{r.resolves ? 'Yes' : 'No'}</td>
                <td className="p-2 border">{r.ipAddress || '-'}</td>
                <td className="p-2 border">{r.source || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </Layout>
  );
};

export default SubdomainFinderResultPage;

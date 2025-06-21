// pages/scanner/subzy-result.tsx
import React, { useEffect, useState } from 'react';
import Layout from '../Layout';
import { useRouter } from 'next/router';

const SubzyResult = () => {
  const [results, setResults] = useState<string[]>([]);
  const [domain, setDomain] = useState('');
  const router = useRouter();

  useEffect(() => {
    const storedResults = localStorage.getItem('subzy_results');
    const storedDomain = localStorage.getItem('scanned_domain');

    if (!storedResults || !storedDomain) {
      router.push('/scanner/subzy'); // Redirect if no data
      return;
    }

    setResults(JSON.parse(storedResults));
    setDomain(storedDomain);
  }, [router]);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Scan Results for {domain}</h1>
        {results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <ul className="list-disc ml-6 space-y-1">
            {results.map((line, index) => (
              <li
              key={index}
              className={
                line.includes('NOT VULNERABLE') ? 'text-green-600' :
                line.includes('VULNERABLE') ? 'text-red-600 font-bold' :
                line.includes('HTTP ERROR') ? 'text-yellow-600' : ''
              }
            >
              {line}
            </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default SubzyResult;

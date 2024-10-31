import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from '../Layout'; // Adjust the import based on your project structure

const AutomaticScannerPage = () => {
  const [url, setUrl] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/api/Home/automatic-scanner',
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('URL submitted successfully!');
      setUrl('');
    } catch (err: unknown) {
      setError('Error submitting URL');
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h1 className="text-3xl mb-5">Automatic Scanner</h1>
        <form onSubmit={handleSubmit} className="flex flex-col max-w-md w-full p-5 bg-white rounded shadow-lg">
          <label className="text-lg mb-2">
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1 p-2 border border-gray-300 rounded w-full"
              placeholder="Enter URL"
            />
          </label>
          <button type="submit" className="mt-4 py-2 px-4 bg-[#1A1A3D] text-white rounded hover:bg-[#2A2A4D] transition">
            Scan
          </button>
        </form>
        {message && <p className="text-green-500 mt-2">{message}</p>}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </main>
    </Layout>
  );
};

export default AutomaticScannerPage;

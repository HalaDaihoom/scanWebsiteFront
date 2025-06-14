// pages/home.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import Layout from './Layout'; // Ensure this matches the file name

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Home = () => {
  const [, setMessage] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/login');
    } else {
      axios
        .get(`${API_URL}/api/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message);
        })
        .catch((err) => {
          console.error('Error fetching protected resource:', err);
          setError('Error fetching protected resource');

          if (err.response && err.response.status === 401) {
            router.push('/login');
          }
        });
    }
  }, [router]);

 

  return (
    <Layout>
      <div className="min-h-screen font-sans bg-gray-900 text-white">
        <main className="flex justify-between p-10 text-white">
          <div className="flex-1 mr-10">
            <h2 className="text-5xl font-bold mb-6">
              Get a hacker perspective on your web apps, network, and cloud
            </h2>
            <p className="text-2xl mb-4">
              Pentest-Tools.com helps security teams run the key steps of a penetration test, easily and without expert hacking skills.
            </p>
            <ul className="text-xl list-disc ml-6 space-y-2">
              <li>Automatically map the attack surface</li>
              <li>Scan for the latest critical vulnerabilities</li>
              <li>Exploit to assess the business risk</li>
            </ul>
          </div>
          <div className="flex-1">
            <div
              className="w-full h-96 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
            ></div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Home;

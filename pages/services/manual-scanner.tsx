// services/manual-scanner.tsx
import React from 'react';
import Layout from '../Layout'; // Adjust the path if necessary

const ManualScanner = () => {
  return (
    <Layout>
      <main className="px-4 py-10 bg-gray-900 text-white">
        <h2 className="text-4xl mb-6">Manual Scanning</h2>
        <p className="text-lg mb-6">
          Manual scanning is a critical process in identifying specific vulnerabilities in web applications. Here are three key vulnerabilities:
        </p>

        <h3 className="text-2xl mt-6">1. Cross-Site Scripting (XSS)</h3>
        <p className="text-lg mb-6">
          XSS occurs when an attacker injects malicious scripts into content that is then served to users. This can lead to session hijacking, defacement, or redirection to malicious sites.
        </p>

        <h3 className="text-2xl mt-6">2. SQL Injection (SQLi)</h3>
        <p className="text-lg mb-6">
          SQLi allows attackers to interfere with the queries that an application makes to its database. This can allow unauthorized access to sensitive data or even the entire database.
        </p>

        <h3 className="text-2xl mt-6">3. Cross-Site Request Forgery (CSRF)</h3>
        <p className="text-lg mb-6">
          CSRF tricks the victim into submitting a request that they did not intend to make. It can exploit the trust that a web application has in the user browser.
        </p>
      </main>
    </Layout>
  );
};

export default ManualScanner;

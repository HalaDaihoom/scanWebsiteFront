// services/automatic-scanner.tsx
import React from 'react';
import Layout from '../Layout'; // Ensure this matches the file name

const AutomaticScanner = () => {
  return (
    <Layout>
      <main className="px-4 py-10 bg-gray-900 text-white">
        <h2 className="text-4xl mb-6">Automatic Scanning Tool</h2>
        <p className="text-lg mb-6">
          Our automatic scanning tool performs a comprehensive analysis of the provided URL to identify vulnerabilities.
        </p>
        <h3 className="text-2xl mt-6">Key Features:</h3>
        <ul className="list-disc list-inside text-lg mb-6">
          <li>Full website scan for vulnerabilities</li>
          <li>Detailed reports on vulnerabilities found</li>
          <li>Severity ratings for each vulnerability</li>
        </ul>
        <h3 className="text-2xl mt-6">How It Works:</h3>
        <p className="text-lg mb-6">
          1. Enter the URL to be scanned.<br />
          2. The tool performs various tests for common vulnerabilities.<br />
          3. A report is generated detailing the vulnerabilities found and their severity.
        </p>
      </main>
    </Layout>
  );
};

export default AutomaticScanner;

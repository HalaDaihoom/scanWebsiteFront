// pages/home.tsx
import React from 'react';
import NewLayout from './homeLayout'; // Import the new layout

const NewHome = () => {
  return (
    <NewLayout>
      <div className="min-h-screen font-sans bg-gray-900 text-white">
        <main className="flex justify-between p-10 text-white">
          <div className="flex-1 mr-10">
            <h2 className="text-5xl font-bold mb-6">
              Discover Our Automatic Vulnerability Scanner
            </h2>
            <p className="text-2xl mb-4">
              Our automatic vulnerability scanner helps you generate comprehensive reports that identify all potential vulnerabilities in your web apps, networks, and cloud environments.
            </p>
            <p className="text-xl mb-4">
              The scanner provides:
            </p>
            <ul className="text-xl list-disc ml-6 space-y-2">
              <li>A full report with all vulnerabilities found</li>
              <li>Details on the level of each vulnerability</li>
              <li>Suggestions on how to mitigate risks and secure your system</li>
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
    </NewLayout>
  );
};

export default NewHome;

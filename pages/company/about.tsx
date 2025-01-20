import React from 'react';
import Layout from '../Layout';

const AboutUs = () => {
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center h-screen py-10 bg-[#0A0A23] text-white">
        <h2 className="text-4xl mb-6 text-left w-full max-w-2xl">About Us</h2>
        <p className="text-lg mb-4 text-left w-full max-w-2xl">
          Our website provides cutting-edge tools for security teams to perform penetration testing and vulnerability assessments. We aim to empower teams with the resources they need to ensure the safety of their applications and infrastructure.
        </p>
        <p className="text-lg mb-4 text-left w-full max-w-2xl">
          We focus on making security accessible, providing automated tools and detailed guides on manual scanning techniques to help users understand the landscape of vulnerabilities.
        </p>
      </main>
    </Layout>
  );
};

export default AboutUs;

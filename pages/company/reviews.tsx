import React from 'react';
import Layout from '../Layout';

const Reviews = () => {
  return (
    <Layout>
      <main className="flex flex-col items-center justify-center min-h-screen py-10 bg-[#0A0A23] text-white">
        <h2 className="text-4xl mb-5">User Reviews</h2>
        <ul className="list-none p-0">
          <li className="text-lg mb-2">
            <strong>John Doe:</strong> The automatic scanning tool helped us identify vulnerabilities in our app quickly and efficiently!
          </li>
          <li className="text-lg mb-2">
            <strong>Jane Smith:</strong> The manual scanning techniques provided detailed insights that improved our security posture.
          </li>
          <li className="text-lg mb-2">
            <strong>Tom Brown:</strong> Great service! The vulnerability reports were thorough and easy to understand.
          </li>
        </ul>
      </main>
    </Layout>
  );
};

export default Reviews;

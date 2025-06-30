// pages/welcome.tsx

import React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react'; // Install lucide-react if needed: npm i lucide-react

const Welcome = () => {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/lock-symbol-and-protection-image_15692197.jpg')" }}
    >
      <div className="p-8 bg-white bg-opacity-80 shadow-lg backdrop-blur-sm border border-white border-opacity-90 rounded-xl max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500" size={64} />
        <h1 className="text-black font-bold text-2xl my-4">Account Created Successfully!</h1>
        <p className="text-black mb-6">You can now login to your account.</p>
        <Link href="/login">
          <button className="p-3 bg-blue-900 text-white rounded-md hover:bg-blue-800 transition-colors w-full">
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Welcome;

// components/homeLayout.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const NewLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen font-sans bg-gray-900 text-white">
      <header className="bg-gray-800 p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">BugSloth</h1>
        <nav className="flex space-x-6">
          <Link href="/login" className="text-white hover:underline">Login</Link>
          <Link href="/register" className="text-white hover:underline">Register</Link>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              {/* <ul className="space-y-2">
                <li>
                  <Link href="/company/about" className="hover:underline">About Us</Link>
                </li>
                <li>
                  <Link href="/company/contact" className="hover:underline">Contact</Link>
                </li>
                <li>
                  <Link href="/company/reviews" className="hover:underline">Reviews</Link>
                </li>
              </ul> */}
            </div>

            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
              <a href="https://facebook.com">
                <Image src="/facebook.png" alt="Facebook" width={24} height={24} />
              </a>

                <a href="https://twitter.com" className="hover:text-gray-400">
                  <img src="/twitter.png" alt="Twitter" className="w-6 h-6"/>
                </a>
                <a href="https://linkedin.com" className="hover:text-gray-400">
                  <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6"/>
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/3 text-center md:text-right">
              <p className="text-gray-300">&copy; {new Date().getFullYear()} BugSloth. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NewLayout;

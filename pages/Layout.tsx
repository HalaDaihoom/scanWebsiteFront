// components/Layout.tsx
import React from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Image from 'next/image';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-white">
      <header className="bg-gray-800 p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vulnerability Scanner</h1>
        <nav className="flex space-x-6">
          <Link href="/userhome" className="text-white hover:underline">Home</Link>

          <div className="relative group">
            <button className="text-white">Scanners</button>
            <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg mt-2 p-2 min-w-[200px]">
              <Link href="/scanner/automatic-scanner" className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap">
                <img src="/auto.png" alt="Automatic Scanner" className="w-6 h-6 mr-2" />
                Automatic Scanner
              </Link>
               <Link href="/scanner/xss-scanner" className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap">
                <img src="/xss.png" alt="XSS Scanner" className="w-6 h-6 mr-2" />
                XSS Scanner
              </Link>
              <Link href="/scanner/sql-injection" className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap">
                <img src="/sqlo.png" alt="SQLI Scanner" className="w-6 h-6 mr-2" />
                SQLI Scanner
              </Link>
              <Link href="/scanner/subdomain/subdomain-takeover" className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap">
                <img src="/csrf.png" alt="CSRF Scanner" className="w-6 h-6 mr-2" />
                Subdomain TakeOver
              </Link> 
              <Link href="/scanner/subzy" className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap">
                <img src="/csrf.png" alt="CSRF Scanner" className="w-6 h-6 mr-2" />
                subzy 
              </Link> 
            </div>
          </div>

          <div className="relative group">
            <button className="text-white">Services</button>
            <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg mt-2 p-2">
              <Link href="/services/automatic-scanner" className="block px-4 py-2 hover:bg-gray-100 rounded">
                Automatic Scanning
              </Link>
              <Link href="/services/manual-scanner" className="block px-4 py-2 hover:bg-gray-100 rounded">
                Manual Scanning
              </Link> 
            </div>
          </div>

      

          <div className="relative group">
            <button className="text-white">Profile</button>
            <div className="absolute hidden group-hover:block bg-white text-black rounded-md shadow-lg mt-2 p-2">
              <Link href="/scanner/scan-history" className="block px-4 py-2 hover:bg-gray-100 rounded">
                Scan History
              </Link>
              {/* <Link href="/profile/subscription" className="block px-4 py-2 hover:bg-gray-100 rounded">
                Subscription
              </Link> */}
            </div>
          </div>

          <button onClick={handleLogout} className="bg-gray-700 border border-white rounded px-4 py-2 hover:bg-gray-600">
            Logout
          </button>
        </nav>
      </header>

      <main>{children}</main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/company/about" className="hover:underline">About Us</Link>
                </li>
                <li>
                  <Link href="/company/contact" className="hover:underline">Contact</Link>
                </li>
                <li>
                  <Link href="/company/reviews" className="hover:underline">Reviews</Link>
                </li>
              </ul>
            </div>

            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" className="hover:text-gray-400">
                  <img src="/facebook.png" alt="Facebook" className="w-6 h-6"/>
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
              <p className="text-gray-300">&copy; {new Date().getFullYear()} Vulnerability Scanner. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

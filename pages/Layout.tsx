import React from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';


const API_URL = process.env.NEXT_PUBLIC_API_URL;


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<{ firstName: string; lastName: string; image: string | null } | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      axios
        .get(`${API_URL}/api/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setProfile(response.data))
        .catch((error) => {
          console.error('Error fetching profile:', error);
          if (error.response?.status === 401) {
            router.push('/login');
          }
        });
    }
  }, [router]);

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms delay before hiding dropdown
  };

  return (
    <div className="min-h-screen font-sans bg-gray-900 text-white">
      <header className="bg-gray-800 p-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vulnerability Scanner</h1>
        <nav className="flex space-x-6 items-center">
          <Link href="/userhome" className="text-white hover:underline">Home</Link>

          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('scanners')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-white">Scanners</button>
            <div
              className={`absolute bg-white text-black rounded-md shadow-lg mt-2 p-2 min-w-[200px] transition-opacity duration-200 ${
                activeDropdown === 'scanners' ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <Link
                href="/scanner/automatic-scanner"
                className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap"
                onClick={() => setActiveDropdown(null)}
              >
                {/* <img src="/auto.png" alt="Automatic Scanner" className="w-6 h-6 mr-2" /> */}
                Automatic Scanner
              </Link>
              <Link
                href="/scanner/xss/xss-scanner"
                className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap"
                onClick={() => setActiveDropdown(null)}
              >
                {/* <img src="/xss.png" alt="XSS Scanner" className="w-6 h-6 mr-2" /> */}
                XSS Scanner
              </Link>
              <Link
                href="/scanner/sql-injection"
                className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap"
                onClick={() => setActiveDropdown(null)}
              >
                {/* <img src="/sqlo.png" alt="SQLI Scanner" className="w-6 h-6 mr-2" /> */}
                SQLI Scanner
              </Link>
              <Link
                href="/scanner/subdomain/subdomain-takeover"
                className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap"
                onClick={() => setActiveDropdown(null)}
              >
                {/* <img src="/csrf.png" alt="CSRF Scanner" className="w-6 h-6 mr-2" /> */}
                Subdomain TakeOver
              </Link>
              <Link
                href="/scanner/subdomain-finder"
                className="flex items-center p-2 hover:bg-gray-100 rounded whitespace-nowrap"
                onClick={() => setActiveDropdown(null)}
              >
                {/* <img src="/csrf.png" alt="CSRF Scanner" className="w-6 h-6 mr-2" /> */}
                subdomain-finder
              </Link>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('services')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-white">Services</button>
            <div
              className={`absolute bg-white text-black rounded-md shadow-lg mt-2 p-2 transition-opacity duration-200 ${
                activeDropdown === 'services' ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <Link
                href="/services/automatic-scanner"
                className="block px-4 py-2 hover:bg-gray-100 rounded"
                onClick={() => setActiveDropdown(null)}
              >
                Automatic Scanning
              </Link>
              <Link
                href="/services/manual-scanner"
                className="block px-4 py-2 hover:bg-gray-100 rounded"
                onClick={() => setActiveDropdown(null)}
              >
                Manual Scanning
              </Link>
            </div>
          </div>

          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('company')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="text-white">Company</button>
            <div
              className={`absolute bg-white text-black rounded-md shadow-lg mt-2 p-2 transition-opacity duration-200 ${
                activeDropdown === 'company' ? 'opacity-100 visible' : 'opacity-0 invisible'
              }`}
            >
              <Link
                href="/company/about"
                className="block px-4 py-2 hover:bg-gray-100 rounded"
                onClick={() => setActiveDropdown(null)}
              >
                About Us
              </Link>
              <Link
                href="/company/reviews"
                className="block px-4 py-2 hover:bg-gray-100 rounded"
                onClick={() => setActiveDropdown(null)}
              >
                Reviews
              </Link>
              <Link
                href="/company/contact"
                className="block px-4 py-2 hover:bg-gray-100 rounded"
                onClick={() => setActiveDropdown(null)}
              >
                Contact Us
              </Link>
            </div>
          </div>

          <button onClick={toggleSidebar} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </nav>
      </header>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="p-4">
          <button onClick={toggleSidebar} className="text-white mb-4 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {profile && (
            <div className="flex flex-col items-center">
              <Link
                href="/profile"
                className="flex items-center space-x-2 hover:bg-gray-700 p-2 rounded w-full"
                onClick={() => setIsSidebarOpen(false)}
              >
                <img
                  src={profile.image || '/default-avatar.png'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <span>{profile.firstName} {profile.lastName}</span>
              </Link>
              <Link
                href="/scanner/scan-history"
                className="block w-full text-left p-2 hover:bg-gray-700 rounded mt-2"
                onClick={() => setIsSidebarOpen(false)}
              >
                Scan History
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full text-left p-2 hover:bg-gray-700 rounded mt-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Overlay for sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        ></div>
      )}

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
                  <img src="/facebook.png" alt="Facebook" className="w-6 h-6" />
                </a>
                <a href="https://twitter.com" className="hover:text-gray-400">
                  <img src="/twitter.png" alt="Twitter" className="w-6 h-6" />
                </a>
                <a href="https://linkedin.com" className="hover:text-gray-400">
                  <img src="/linkedin.png" alt="LinkedIn" className="w-6 h-6" />
                </a>
              </div>
            </div>

            <div className="w-full md:w-1/3 text-center md:text-right">
              <p className="text-gray-300">© {new Date().getFullYear()} Vulnerability Scanner. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
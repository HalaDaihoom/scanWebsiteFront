/*import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const AutomaticScannerPage = () => {
  const [url, setUrl] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/Home/automatic-scanner',
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('URL submitted successfully!');
      setUrl('');
    } catch (err: unknown) {
      setError('Error submitting URL');
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  return (
    <div>
      <h1>Automatic Scanner</h1>
      <form onSubmit={handleSubmit}>
        <label>
          URL:
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
    </div>
  );
};

export default AutomaticScannerPage;
*/


import React, { useEffect, useState, CSSProperties } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const AutomaticScannerPage = () => {
  const [url, setUrl] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = Cookies.get('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:5000/api/Home/automatic-scanner',
        { url },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('URL submitted successfully!');
      setUrl('');
    } catch (err: unknown) {
      setError('Error submitting URL');
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login');
      }
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={logoStyle}>Automatic Scanner</h1>
        <button style={logoutButtonStyle} onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main style={mainStyle}>
        <form onSubmit={handleSubmit} style={formStyle}>
          <label style={labelStyle}>
            URL:
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={inputStyle}
            />
          </label>
          <button type="submit" style={submitButtonStyle}>Scan</button>
        </form>
        {message && <p style={successMessageStyle}>{message}</p>}
        {error && <p style={errorMessageStyle}>{error}</p>}
      </main>
    </div>
  );
};

// Styles (same as in Home or similar)
const containerStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'Arial, sans-serif',
};

const headerStyle: CSSProperties = {
  backgroundColor: '#1A1A3D',
  width: '100%',
  padding: '20px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const logoStyle: CSSProperties = {
  color: '#FFF',
  fontSize: '24px',
};

const logoutButtonStyle: CSSProperties = {
  backgroundColor: '#1A1A1A',
  color: '#FFF',
  padding: '10px 20px',
  cursor: 'pointer',
  borderRadius: '4px',
  border: '1px solid #FFF',
};

const mainStyle: CSSProperties = {
  padding: '40px',
};

const formStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '500px',
  width: '100%',
};

const labelStyle: CSSProperties = {
  fontSize: '18px',
  marginBottom: '10px',
  color: '#333',
};

const inputStyle: CSSProperties = {
  padding: '10px',
  fontSize: '16px',
  borderRadius: '4px',
  border: '1px solid #ccc',
  marginBottom: '20px',
  width: '100%',
};

const submitButtonStyle: CSSProperties = {
  padding: '10px 20px',
  fontSize: '16px',
  backgroundColor: '#1A1A3D',
  color: '#FFF',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '4px',
};

const successMessageStyle: CSSProperties = {
  color: 'green',
  fontSize: '16px',
  marginTop: '10px',
};

const errorMessageStyle: CSSProperties = {
  color: 'red',
  fontSize: '16px',
  marginTop: '10px',
};

export default AutomaticScannerPage;

import React, { useState } from "react";
import type { NextPage } from "next";


const Home: NextPage = () => {
  const [subdomain, setSubdomain] = useState<string>("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkSubdomain = async () => {
    setLoading(true);
    setResult(null);

    try {
        const res = await fetch("http://scan-website.runasp.net/api/scan-subdomain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: subdomain }),
        });
      
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`HTTP ${res.status} - ${errorText}`);
        }
      
        const data = await res.json();
        setResult(data.message || "No response");
      } catch (error: any) {
        setResult(`Error contacting server: ${error.message}`);
      }
      

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>🔍 Subdomain Takeover Checker</h1>
      <input
        type="text"
        placeholder="Enter subdomain (e.g., test.example.com)"
        value={subdomain}
        onChange={(e) => setSubdomain(e.target.value)}
        style={{ padding: "0.5rem", width: "300px", marginRight: "1rem" }}
      />
      <button onClick={checkSubdomain} disabled={loading}>
        {loading ? "Checking..." : "Check"}
      </button>
      {result && (
        <div style={{ marginTop: "1rem", fontWeight: "bold" }}>{result}</div>
      )}
    </div>
  );
};

export default Home;

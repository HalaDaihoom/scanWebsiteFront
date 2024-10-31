// company/contact.tsx
import React, { useState } from 'react';
import Layout from '../Layout';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Message sent!\nName: ${name}\nEmail: ${email}\nMessage: ${message}`);
  };

  return (
    <Layout>
      <h2 className="text-4xl mb-5">Contact Us</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <label className="flex flex-col">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 rounded border border-gray-700"
            required
          />
        </label>
        <label className="flex flex-col">
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded border border-gray-700"
            required
          />
        </label>
        <label className="flex flex-col">
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="p-2 rounded border border-gray-700 min-h-[100px]"
            required
          />
        </label>
        <button type="submit" className="bg-gray-800 border border-white p-2 rounded">
          Send
        </button>
      </form>
    </Layout>
  );
};

export default ContactUs;

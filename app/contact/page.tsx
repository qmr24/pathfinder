"use client";
import { useState } from "react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // For now this just shows a success message
  // You can wire this to an email service like Resend or Formspree later
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-navy-900 mb-2">Contact us</h1>
      <p className="text-gray-500 mb-10">
        Have a question about your results or a resource request? Send us a message.
      </p>

      {sent ? (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-6 py-8 text-center">
          <p className="font-semibold text-lg mb-1">Message received!</p>
          <p className="text-sm">We'll get back to you as soon as possible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <textarea
              name="message"
              required
              rows={5}
              value={form.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
              placeholder="Your message…"
            />
          </div>
          <button
            type="submit"
            className="bg-navy-800 hover:bg-navy-900 text-white font-medium px-8 py-3 rounded transition-colors text-sm"
          >
            Send message
          </button>
        </form>
      )}
    </div>
  );
}

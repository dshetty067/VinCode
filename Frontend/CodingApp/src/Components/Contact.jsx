import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

function Contact() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white pt-24 px-6 md:px-20 flex flex-col items-center justify-center">
        {/* Contact Card */}
        <div className="max-w-xl w-full bg-white border border-gray-200 rounded-2xl shadow-xl p-8 mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2">Get in Touch</h1>
          <p className="text-gray-600 italic mb-6">
            "Where Coding meets rewards !!! Show your Coding Skills and win rewards. Instant Money Withdrawals and many more."
          </p>

          <div className="space-y-4 text-left bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
            <div>
              <span className="font-semibold text-gray-800">Platform:</span> VinCode
            </div>
            <div>
              <span className="font-semibold text-gray-800">Support Email:</span> dhanushpshetty.is23@rvce.edu.in
            </div>
          </div>

          <div className="flex justify-center gap-6 text-sm font-medium">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              GitHub Repository
            </a>
            <a href="/about" className="text-blue-600 hover:underline">
              About Page
            </a>
            <a href="/contests" className="text-blue-600 hover:underline">
              Active Contests
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Contact;
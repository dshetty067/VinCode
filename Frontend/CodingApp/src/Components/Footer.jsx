import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center">

          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Project</h3>
            <p className="text-gray-600 text-sm max-w-xs">
              Where Coding meets rewards !!!
              Show your Coding Skills and win rewards.
              Instant Money Withdrawals and many more.
            </p>
          </div>

          {/* Features Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Features</h3>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600 text-left max-w-xs mx-auto">
              <li>💻 Real-time Contests</li>
              <li>💰 Prize Pool System</li>
              <li>📊 Leaderboards</li>
              <li>📈 Advanced Challenges</li>
              <li>🪙 Wallet System</li>
            </ul>
          </div>

          {/* Project Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Project</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">GitHub Repository</a></li>
              <li><a href="/about" className="hover:underline">About Page</a></li>
              <li><a href="/contact" className="hover:underline">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 text-gray-500 text-sm">
          © 2025 VinCode by Dhanush P Shetty. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

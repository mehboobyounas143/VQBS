import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="flex justify-center space-x-6">
          {/* Social Media Links */}
          <a href="https://facebook.com" className="text-white hover:text-secondary">Facebook</a>
          <a href="https://twitter.com" className="text-white hover:text-secondary">Twitter</a>
          <a href="https://linkedin.com" className="text-white hover:text-secondary">LinkedIn</a>
        </div>

        <div className="mt-4">
          <p className="text-sm">© 2024 VQBS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

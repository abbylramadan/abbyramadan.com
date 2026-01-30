const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-sm text-gray-400 py-8 px-4 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto text-center space-y-4">
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-300 transition-colors">
            GitHub
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-300 transition-colors">
            LinkedIn
          </a>
          <a href="mailto:contact@abbyramadan.com" className="text-gray-400 hover:text-purple-300 transition-colors">
            Email
          </a>
        </div>
        <p>&copy; 2025 Abby Ramadan. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
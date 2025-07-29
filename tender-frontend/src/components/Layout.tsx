import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiUpload, FiDownload } from 'react-icons/fi';

const Layout = () => {
  const location = useLocation();

  // Navigation items
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Download Templates', path: '/download' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with green gradient background */}
      <div className="bg-gradient-to-r from-pwd-green via-pwd-green/90 to-pwd-green-light text-white p-6 rounded-b-lg shadow-md">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">
            🏗️ Enhanced Tender Processing System
          </h1>
          <p className="text-center text-lg opacity-90 mb-2">
            Generate professional tender documents with LaTeX PDF compliance automatically
          </p>
          <p className="text-center text-pwd-text-light opacity-85 italic mb-1">
            Streamlined government tender documentation with statutory compliance and automated calculations
          </p>
          <p className="text-center text-sm text-white/90 mt-3">
            An Initiative by Mrs. Premlata Jain, Additional Administrative Officer, PWD, Udaipur
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center space-x-8 py-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'border-pwd-green text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <Outlet />
        </div>
      </main>

      {/* Footer with credits */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-sm font-medium text-gray-900">Credits</h3>
              <p className="mt-2 text-sm text-gray-500">
                An Initiative By<br />
                <span className="font-medium">Mrs. Premlata Jain</span><br />
                Additional Administrative Officer<br />
                PWD, Udaipur
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-sm font-medium text-gray-900">System Info</h3>
              <p className="mt-2 text-sm text-gray-500">
                Enhanced Tender Processing System v2.0<br />
                Built with React, TypeScript & Tailwind CSS
              </p>
            </div>
            <div className="text-center md:text-right">
              <h3 className="text-sm font-medium text-gray-900">Contact</h3>
              <p className="mt-2 text-sm text-gray-500">
                Public Works Department<br />
                Udaipur, Rajasthan<br />
                India
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} PWD Udaipur. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

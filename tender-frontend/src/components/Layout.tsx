import { Outlet, Link } from 'react-router-dom';
import { FiHome, FiUpload, FiDownload } from 'react-icons/fi';

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">TenderKimi</h1>
        </div>
        <nav className="mt-6">
          <NavItem to="/" icon={<FiHome className="w-5 h-5" />}>
            Home
          </NavItem>
          <NavItem to="/upload" icon={<FiUpload className="w-5 h-5" />}>
            Upload Tender
          </NavItem>
          <NavItem to="/download" icon={<FiDownload className="w-5 h-5" />}>
            Download Templates
          </NavItem>
        </nav>
      </div>

      {/* Main content */}
      <div className="pl-64">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <Link
    to={to}
    className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
  >
    <span className="mr-3">{icon}</span>
    <span className="font-medium">{children}</span>
  </Link>
);

export default Layout;

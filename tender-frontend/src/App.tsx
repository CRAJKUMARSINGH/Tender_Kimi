import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import Layout from './components/Layout';
import UploadPage from './pages/UploadPage';
import DownloadPage from './pages/DownloadPage';

// Simple home page component
const HomePage = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Welcome to Tender Management System</h2>
    <p className="text-gray-600 mb-6">
      Streamline your tender management process with our comprehensive solution. Get started by uploading a new tender or downloading templates.
    </p>
    <div className="grid md:grid-cols-2 gap-6 mt-8">
      <div className="bg-pwd-green/5 p-6 rounded-lg border border-pwd-green/20">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Tender</h3>
        <p className="text-gray-600 mb-4">Upload your tender documents for processing and analysis.</p>
        <Link
          to="/upload"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pwd-green hover:bg-pwd-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pwd-green"
        >
          Go to Upload
        </Link>
      </div>
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Download Templates</h3>
        <p className="text-gray-600 mb-4">Access and download the latest tender document templates.</p>
        <Link
          to="/download"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          View Templates
        </Link>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="download" element={<DownloadPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;

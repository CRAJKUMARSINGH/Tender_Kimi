import { useState, useEffect } from 'react';
import { FiDownload, FiExternalLink, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { downloadTemplate, checkHealth } from '../lib/api';
import { toast } from 'react-hot-toast';

type Template = {
  id: string;
  name: string;
  description: string;
  file: string;
  size: string;
  lastUpdated: string;
  status?: 'idle' | 'downloading' | 'success' | 'error';
  error?: string;
};

const DownloadPage = () => {
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: 'single_work_nit.xlsx',
      name: 'Single Work NIT',
      description: 'Template for single work Notice Inviting Tender (NIT)',
      file: 'single_work_nit.xlsx',
      size: '45 KB',
      lastUpdated: '2023-10-15',
      status: 'idle'
    },
    {
      id: 'multi_work_nit.xlsx',
      name: 'Multi-Work NIT (2-15 works)',
      description: 'Template for multiple works Notice Inviting Tender (2-15 works)',
      file: 'multi_work_nit.xlsx',
      size: '52 KB',
      lastUpdated: '2023-10-15',
      status: 'idle'
    },
    {
      id: 'tender_document.docx',
      name: 'Tender Document',
      description: 'Complete tender document template',
      file: 'tender_document.docx',
      size: '128 KB',
      lastUpdated: '2023-10-10',
      status: 'idle'
    }
  ]);

  // Check API health on component mount
  const { data: health, isLoading: isHealthLoading } = useQuery({
    queryKey: ['health'],
    queryFn: checkHealth,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const handleDownload = async (template: Template) => {
    try {
      // Update template status to downloading
      setTemplates(prev =>
        prev.map(t =>
          t.id === template.id
            ? { ...t, status: 'downloading' as const, error: undefined }
            : t
        )
      );

      // Download the template
      await downloadTemplate(template.id);

      // Update status to success
      setTemplates(prev =>
        prev.map(t =>
          t.id === template.id
            ? { ...t, status: 'success' as const }
            : t
        )
      );

      toast.success(`Downloaded ${template.name} successfully!`);

      // Reset status after 3 seconds
      setTimeout(() => {
        setTemplates(prev =>
          prev.map(t =>
            t.id === template.id
              ? { ...t, status: 'idle' as const }
              : t
          )
        );
      }, 3000);

    } catch (error: any) {
      // Update status to error
      setTemplates(prev =>
        prev.map(t =>
          t.id === template.id
            ? {
                ...t,
                status: 'error' as const,
                error: error.message || 'Download failed'
              }
            : t
        )
      );

      // Auto-clear error after 5 seconds
      setTimeout(() => {
        setTemplates(prev =>
          prev.map(t =>
            t.id === template.id
              ? { ...t, status: 'idle' as const, error: undefined }
              : t
          )
        );
      }, 5000);
    }
  };

  const getStatusIcon = (status: Template['status']) => {
    switch (status) {
      case 'downloading':
        return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'success':
        return <FiCheckCircle className="text-green-500" />;
      case 'error':
        return <FiAlertCircle className="text-red-500" />;
      default:
        return <FiDownload className="text-gray-400 group-hover:text-blue-500 transition-colors" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Download Templates</h1>
        <div className="flex items-center text-sm text-gray-500">
          {isHealthLoading ? (
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
              <span>Checking API status...</span>
            </div>
          ) : health?.status === 'ok' ? (
            <div className="flex items-center text-green-600">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span>API is online</span>
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
              <span>API is offline</span>
            </div>
          )}
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Download the latest templates for tender documents. These templates are pre-formatted to meet standard requirements.
      </p>

      <div className="space-y-4">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`group relative flex items-center justify-between p-4 rounded-lg border ${
              template.status === 'error'
                ? 'bg-red-50 border-red-200'
                : 'bg-white border-gray-200 hover:border-blue-200 hover:shadow-sm'
            } transition-all`}
          >
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <FiFile className="w-5 h-5 text-blue-600" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-gray-900">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {template.description}
                </p>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>{template.size}</span>
                  <span>•</span>
                  <span>Updated {template.lastUpdated}</span>
                </div>

                {template.error && (
                  <div className="mt-2 flex items-center text-xs text-red-600">
                    <FiAlertCircle className="mr-1.5 flex-shrink-0" />
                    <span>{template.error}</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleDownload(template)}
              disabled={template.status === 'downloading'}
              className={`ml-4 px-4 py-2 rounded-md text-sm font-medium ${
                template.status === 'downloading'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'text-white bg-pwd-green hover:bg-pwd-green/90'
              } transition-colors flex items-center space-x-2`}
            >
              <span>{template.status === 'downloading' ? 'Downloading...' : 'Download'}</span>
              {getStatusIcon(template.status)}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Need help with templates?</h3>
        <p className="text-sm text-blue-700 mb-3">
          If you're having trouble with any of the templates, please refer to our documentation or contact support.
        </p>
        <a
          href="#"
          className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          onClick={(e) => {
            e.preventDefault();
            toast('Documentation link will be available soon', { icon: 'ℹ️' });
          }}
        >
          View documentation <FiExternalLink className="ml-1.5" />
        </a>
      </div>
    </div>
  );
};

export default DownloadPage;

import { useState } from 'react';
import { FiDownload, FiExternalLink } from 'react-icons/fi';

type Template = {
  id: string;
  name: string;
  description: string;
  file: string;
  size: string;
  lastUpdated: string;
};

const templates: Template[] = [
  {
    id: 'single-work-nit',
    name: 'Single Work NIT',
    description: 'Template for single work Notice Inviting Tender (NIT)',
    file: 'single_work_nit.xlsx',
    size: '45 KB',
    lastUpdated: '2023-10-15'
  },
  {
    id: 'multi-work-nit',
    name: 'Multi-Work NIT (2-15 works)',
    description: 'Template for multiple works Notice Inviting Tender (2-15 works)',
    file: 'multi_work_nit.xlsx',
    size: '52 KB',
    lastUpdated: '2023-10-15'
  },
  {
    id: 'tender-document',
    name: 'Tender Document',
    description: 'Complete tender document template',
    file: 'tender_document.docx',
    size: '128 KB',
    lastUpdated: '2023-10-10'
  }
];

const DownloadPage = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (template: Template) => {
    setIsDownloading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/download/${template.id}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = template.file;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      console.log(`Downloaded ${template.name}`);
    } catch (error) {
      console.error('Error downloading template:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Download Templates</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-gray-900">Available Templates</h2>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => setSelectedTemplate(template)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{template.name}</h3>
                    <p className="text-sm text-gray-500">{template.description}</p>
                    <div className="mt-2 flex items-center text-xs text-gray-500">
                      <span>{template.size}</span>
                      <span className="mx-2">•</span>
                      <span>Updated {template.lastUpdated}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(template);
                    }}
                    disabled={isDownloading}
                    className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Download template"
                  >
                    <FiDownload className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 border border-gray-200 rounded-lg">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            {selectedTemplate ? 'Template Details' : 'Select a template'}
          </h2>

          {selectedTemplate ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900">{selectedTemplate.name}</h3>
                <p className="mt-1 text-sm text-gray-600">{selectedTemplate.description}</p>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">File:</span>
                    <span className="font-medium">{selectedTemplate.file}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Size:</span>
                    <span>{selectedTemplate.size}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-gray-500">Last updated:</span>
                    <span>{selectedTemplate.lastUpdated}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => handleDownload(selectedTemplate)}
                  disabled={isDownloading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FiDownload className="w-4 h-4 mr-2" />
                  {isDownloading ? 'Downloading...' : 'Download Template'}
                </button>
              </div>

              <div className="mt-4 text-center">
                <a
                  href="#"
                  className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View documentation
                  <FiExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Select a template to view details and download</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;

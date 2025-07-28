import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to TenderKimi</h1>
        <p className="text-xl text-gray-600">
          Streamline your tender management process with our powerful tools
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          title="Upload Tender"
          description="Upload and process tender documents in Excel format"
          to="/upload"
          buttonText="Go to Upload"
          icon={
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          }
        />

        <Card
          title="Download Templates"
          description="Get started with our pre-built tender templates"
          to="/download"
          buttonText="View Templates"
          icon={
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }
        />
      </div>
    </div>
  );
};

const Card = ({
  title,
  description,
  to,
  buttonText,
  icon
}: {
  title: string;
  description: string;
  to: string;
  buttonText: string;
  icon: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg mr-4">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <p className="text-gray-600 mb-6">{description}</p>
      <Link
        to={to}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {buttonText}
      </Link>
    </div>
  </div>
);

export default HomePage;

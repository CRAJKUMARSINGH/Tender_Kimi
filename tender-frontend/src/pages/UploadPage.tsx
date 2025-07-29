import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload, FiX, FiFile, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';
import api from '../lib/api';

type FileWithPreview = File & { preview: string };

interface UploadResponse {
  message: string;
  data: any;
}

interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

const UploadPage = () => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const queryClient = useQueryClient();

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      files.forEach(file => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const uploadFile = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post<UploadResponse>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      throw new Error(axiosError.response?.data?.message || 'Upload failed. Please try again.');
    }
  }, []);

  const { mutate: uploadMutation, isLoading: isUploading } = useMutation(uploadFile, {
    onMutate: () => {
      setUploadStatus('uploading');
      setUploadProgress(0);
    },
    onSuccess: (data) => {
      setUploadStatus('success');
      toast.success('File uploaded successfully!');
      // Invalidate any queries that need to be refetched
      queryClient.invalidateQueries(['templates']);
      // Reset form after successful upload
      setTimeout(() => {
        setFiles([]);
        setUploadStatus('idle');
      }, 2000);
    },
    onError: (error: Error) => {
      setUploadStatus('error');
      toast.error(error.message);
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file)
      })
    );
    setFiles(newFiles);
  }, []);

  const removeFile = (fileName: string) => {
    setFiles(files.filter(file => file.name !== fileName));
    setUploadStatus('idle');
  };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    disabled: uploadStatus === 'uploading' || files.length > 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) return;
    uploadMutation(files[0]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Upload Tender Document</h1>

        {fileRejections.length > 0 && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">
                {fileRejections[0].errors[0].code === 'file-too-large'
                  ? 'File is too large. Maximum size is 5MB.'
                  : 'Invalid file type. Please upload an Excel file (.xlsx, .xls).'}

              </p>
            </div>
          </div>
        )}

        {uploadStatus === 'success' ? (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
              <FiCheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <p className="text-green-700">File uploaded successfully!</p>
            </div>
          </div>
        ) : uploadStatus === 'error' ? (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <FiAlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">Upload failed. Please try again.</p>
            </div>
          </div>
        ) : null}

        {files.length === 0 ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center space-y-2">
              <FiUpload className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium text-gray-700">
                {isDragActive ? 'Drop the file here' : 'Drag & drop your Excel file here, or click to select'}
              </p>
              <p className="text-sm text-gray-500">
                Supported formats: .xlsx, .xls (Max size: 5MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                <div className="flex items-center">
                  <FiFile className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="font-medium text-gray-700 truncate max-w-xs">
                    {files[0].name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(files[0].name)}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={uploadStatus === 'uploading'}
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {uploadStatus === 'uploading' && (
                <div className="p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 text-right">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => setFiles([])}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={uploadStatus === 'uploading'}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploadStatus === 'uploading'}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  uploadStatus === 'uploading' ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {uploadStatus === 'uploading' ? 'Uploading...' : 'Upload File'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;

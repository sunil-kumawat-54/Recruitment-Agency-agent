import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  selectedFiles,
  accept = {
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  },
  multiple = false,
  maxSize = 10485760 // 10MB
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      onFilesSelected(acceptedFiles);
      if (multiple) {
        toast.success(`Successfully loaded ${acceptedFiles.length} file(s).`);
      } else {
        toast.success(`Successfully loaded: ${acceptedFiles[0].name}`);
      }
    }
  }, [onFilesSelected, multiple]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    multiple,
    maxSize
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? 'border-brand-purple bg-brand-purple/5'
          : selectedFiles.length > 0
          ? 'border-brand-emerald bg-brand-emerald/[0.02]'
          : 'border-brand-border hover:border-brand-purple/40 hover:bg-slate-900/20'
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center space-y-3">
        {selectedFiles.length > 0 ? (
          <div className="p-3.5 bg-brand-emerald/10 rounded-2xl border border-brand-emerald/20 text-brand-emerald">
            <CheckCircle className="w-8 h-8" />
          </div>
        ) : (
          <div className="p-3.5 bg-slate-900 rounded-2xl border border-brand-border text-brand-purple">
            <UploadCloud className="w-8 h-8" />
          </div>
        )}
        
        <div>
          <p className="text-slate-200 font-semibold text-sm">
            {selectedFiles.length > 0
              ? multiple
                ? `Selected ${selectedFiles.length} resume files`
                : selectedFiles[0].name
              : isDragActive
              ? 'Drop files here...'
              : 'Drag & drop resumes here'}
          </p>
          <p className="text-xs text-brand-gray mt-1">
            {selectedFiles.length > 0
              ? multiple
                ? 'Click or drag files to add/swap collection'
                : `${(selectedFiles[0].size / 1024).toFixed(1)} KB | Click to swap file`
              : 'Supports PDF or DOCX formats (Max size 10MB)'}
          </p>
        </div>
      </div>
    </div>
  );
};

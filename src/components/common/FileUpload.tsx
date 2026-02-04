'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileImage, FileText, Check, AlertCircle, Eye } from 'lucide-react';
import Image from 'next/image';
import { useLanguage } from '@/contexts/LanguageContext';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  maxSize?: number; // in MB
  value?: File | null;
  error?: string;
  preview?: boolean;
}

const ACCEPTED_TYPES = {
  'image/png': { ext: 'PNG', icon: FileImage },
  'image/jpeg': { ext: 'JPG', icon: FileImage },
  'image/jpg': { ext: 'JPG', icon: FileImage },
  'application/pdf': { ext: 'PDF', icon: FileText },
  'application/postscript': { ext: 'AI', icon: FileText },
  'image/vnd.adobe.photoshop': { ext: 'PSD', icon: FileImage },
};

export function FileUpload({
  onFileSelect,
  accept = 'image/png,image/jpeg,application/pdf',
  maxSize = 10,
  value,
  error,
  preview = true,
}: FileUploadProps) {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return false;
    }
    // Check file type
    const acceptedTypes = accept.split(',').map((t) => t.trim());
    return acceptedTypes.some((type) => file.type === type || file.name.toLowerCase().endsWith(type.replace('image/', '.').replace('application/', '.')));
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
      return;
    }

    setUploadStatus('uploading');

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }

    // Simulate upload delay
    setTimeout(() => {
      setUploadStatus('success');
      onFileSelect(file);
    }, 500);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleRemove = () => {
    setUploadStatus('idle');
    setPreviewUrl(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const getFileIcon = (file: File) => {
    const typeInfo = ACCEPTED_TYPES[file.type as keyof typeof ACCEPTED_TYPES];
    const Icon = typeInfo?.icon || FileText;
    return <Icon className="w-8 h-8 text-gray-400" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full">
      {/* Upload Area */}
      {!value ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-primary bg-primary/5'
              : error
              ? 'border-red-300 bg-red-50'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50'
          }`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />

          <AnimatePresence mode="wait">
            {uploadStatus === 'uploading' ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-600">{t('fileUpload.uploading')}</p>
              </motion.div>
            ) : isDragging ? (
              <motion.div
                key="dragging"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <Upload className="w-12 h-12 text-primary mb-4" />
                <p className="text-primary font-semibold">{t('fileUpload.dragActive')}</p>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-900 font-semibold mb-1">{t('fileUpload.title')}</p>
                <p className="text-gray-500 text-sm mb-4">{t('fileUpload.subtitle')}</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {t('fileUpload.browse')}
                </button>
                <p className="text-xs text-gray-400 mt-4">{t('fileUpload.supportedFormats')}</p>
                <p className="text-xs text-gray-400">{t('fileUpload.maxSize')}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* File Preview */
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border border-gray-200 rounded-lg p-4 bg-white"
        >
          <div className="flex items-start gap-4">
            {/* Preview/Icon */}
            <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              {previewUrl && preview ? (
                <>
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Eye className="w-6 h-6 text-white" />
                  </button>
                </>
              ) : (
                getFileIcon(value)
              )}
            </div>

            {/* File Info */}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{value.name}</p>
              <p className="text-sm text-gray-500">{formatFileSize(value.size)}</p>
              <div className="flex items-center gap-1 mt-1 text-green-600">
                <Check className="w-4 h-4" />
                <span className="text-sm">{t('fileUpload.uploadSuccess')}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {t('fileUpload.changeFile')}
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </motion.div>
      )}

      {/* Error Message */}
      {(error || uploadStatus === 'error') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 mt-2 text-red-600"
        >
          <AlertCircle className="w-4 h-4" />
          <p className="text-sm">{error || t('fileUpload.uploadError')}</p>
        </motion.div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setShowPreviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <X className="w-8 h-8" />
              </button>
              <Image
                src={previewUrl}
                alt="Preview"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FileUpload;

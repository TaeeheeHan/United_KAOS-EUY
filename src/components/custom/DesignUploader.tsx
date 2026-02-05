'use client';

import { useRef, useCallback, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Type, Image as ImageIcon } from 'lucide-react';
import { useCustomDesignStore } from '@/stores/customDesign';
import { Button } from '@/components/common/Button';

type UploadMode = 'image' | 'text';

export function DesignUploader() {
  const {
    activePosition,
    front,
    back,
    leftArm,
    rightArm,
    setPartImage,
    setPartText,
    resetPart,
  } = useCustomDesignStore();

  const [mode, setMode] = useState<UploadMode>('image');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getCurrentPart = () => {
    switch (activePosition) {
      case 'front': return front;
      case 'back': return back;
      case 'leftArm': return leftArm;
      case 'rightArm': return rightArm;
    }
  };

  const currentPart = getCurrentPart();

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

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type.startsWith('image/')) {
          setPartImage(activePosition, file);
        }
      }
    },
    [activePosition, setPartImage]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPartImage(activePosition, files[0]);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPartText(activePosition, e.target.value);
  };

  const handleRemove = () => {
    resetPart(activePosition);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const positionLabels = {
    front: 'Front',
    back: 'Back',
    leftArm: 'Left Sleeve',
    rightArm: 'Right Sleeve',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">
          Design for {positionLabels[activePosition]}
        </h3>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setMode('image')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
              mode === 'image'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            Image
          </button>
          <button
            onClick={() => setMode('text')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1 ${
              mode === 'text'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Type className="w-4 h-4" />
            Text
          </button>
        </div>
      </div>

      {mode === 'image' ? (
        <>
          {currentPart.previewUrl ? (
            <div className="relative border-2 border-gray-200 rounded-xl p-4">
              <div className="relative aspect-video bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  src={currentPart.previewUrl}
                  alt="Design preview"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm text-gray-600">
                  {currentPart.imageFile?.name}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => inputRef.current?.click()}
                  >
                    Change
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRemove}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <div className="flex flex-col items-center">
                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-gray-400" />
                </div>
                <p className="font-medium text-gray-900 mb-1">
                  {isDragging ? 'Drop your file here' : 'Upload your design'}
                </p>
                <p className="text-sm text-gray-500 mb-3">
                  Drag & drop or click to browse
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, SVG (max 10MB)
                </p>
              </div>
            </div>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      ) : (
        <div className="space-y-3">
          <textarea
            value={currentPart.text}
            onChange={handleTextChange}
            placeholder="Enter your custom text..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
          />
          <p className="text-xs text-gray-500">
            Your text will be printed on the {positionLabels[activePosition].toLowerCase()} of the shirt.
          </p>
        </div>
      )}
    </div>
  );
}

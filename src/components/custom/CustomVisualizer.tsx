'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useCustomDesignStore, CustomPosition } from '@/stores/customDesign';

interface CustomVisualizerProps {
  baseColor: string;
  productImage?: string;
}

const positionLabels: Record<CustomPosition, string> = {
  front: 'Front',
  back: 'Back',
  leftArm: 'Left Sleeve',
  rightArm: 'Right Sleeve',
};

const positionOverlayStyles: Record<CustomPosition, React.CSSProperties> = {
  front: { top: '25%', left: '50%', transform: 'translateX(-50%)', width: '40%', height: '35%' },
  back: { top: '25%', left: '50%', transform: 'translateX(-50%)', width: '40%', height: '35%' },
  leftArm: { top: '20%', left: '10%', width: '15%', height: '25%' },
  rightArm: { top: '20%', right: '10%', width: '15%', height: '25%' },
};

export function CustomVisualizer({ baseColor, productImage }: CustomVisualizerProps) {
  const { activePosition, setActivePosition, front, back, leftArm, rightArm } = useCustomDesignStore();
  const positions: CustomPosition[] = ['front', 'back', 'leftArm', 'rightArm'];

  const getCurrentPart = () => {
    switch (activePosition) {
      case 'front': return front;
      case 'back': return back;
      case 'leftArm': return leftArm;
      case 'rightArm': return rightArm;
    }
  };

  const currentPart = getCurrentPart();

  return (
    <div className="space-y-4">
      {/* Main Visualizer */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden"
        style={{ backgroundColor: baseColor || '#f3f4f6' }}
      >
        {/* Base T-shirt illustration */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            viewBox="0 0 200 200"
            className="w-4/5 h-4/5"
            fill="currentColor"
            style={{ color: baseColor || '#e5e7eb' }}
          >
            {/* Simple T-shirt shape */}
            <path
              d="M40 50 L60 30 L80 45 L120 45 L140 30 L160 50 L145 65 L145 170 L55 170 L55 65 Z"
              fill="currentColor"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            {/* Left sleeve */}
            <path
              d="M40 50 L20 80 L35 90 L55 65 Z"
              fill="currentColor"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            {/* Right sleeve */}
            <path
              d="M160 50 L180 80 L165 90 L145 65 Z"
              fill="currentColor"
              stroke="#d1d5db"
              strokeWidth="2"
            />
            {/* Collar */}
            <path
              d="M80 45 Q100 55 120 45"
              fill="none"
              stroke="#d1d5db"
              strokeWidth="2"
            />
          </svg>
        </div>

        {/* Custom Design Overlay */}
        <AnimatePresence mode="wait">
          {currentPart.previewUrl && (
            <motion.div
              key={activePosition}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute"
              style={{
                ...positionOverlayStyles[activePosition],
                position: 'absolute',
              }}
            >
              <Image
                src={currentPart.previewUrl}
                alt="Custom design"
                fill
                className="object-contain"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Text Overlay */}
        {currentPart.text && !currentPart.previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute flex items-center justify-center text-white font-bold text-lg"
            style={{
              ...positionOverlayStyles[activePosition],
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            }}
          >
            {currentPart.text}
          </motion.div>
        )}

        {/* Position indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium">
          {positionLabels[activePosition]}
        </div>
      </div>

      {/* Position Tabs */}
      <div className="flex gap-2">
        {positions.map((pos) => {
          const part = pos === 'front' ? front : pos === 'back' ? back : pos === 'leftArm' ? leftArm : rightArm;
          const isActive = activePosition === pos;
          const hasContent = part.applied || part.previewUrl || part.text;

          return (
            <button
              key={pos}
              onClick={() => setActivePosition(pos)}
              className={`flex-1 py-3 px-2 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {positionLabels[pos]}
              {hasContent && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

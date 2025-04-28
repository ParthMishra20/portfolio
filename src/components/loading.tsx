"use client"

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';

const LoadingScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate loading time for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isLoading ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`fixed inset-0 flex flex-col items-center justify-center z-50 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-800'}`}
    >
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative w-20 h-20 mb-6"
        >
          <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
          <div className="absolute inset-2 border-4 border-emerald-500 rounded-full border-b-transparent animate-spin" style={{ animationDuration: '1.5s' }}></div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-xl font-medium text-gray-100 mb-2">Loading Portfolio</p>
          <div className="flex justify-center space-x-2 mt-3">
            <div className="w-3 h-3 bg-indigo-500 rounded-full loading-dot loading-dot-1"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full loading-dot loading-dot-2"></div>
            <div className="w-3 h-3 bg-indigo-500 rounded-full loading-dot"></div>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute bottom-10 text-sm text-gray-400"
      >
        Preparing interactive experience...
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
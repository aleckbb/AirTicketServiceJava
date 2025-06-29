import React from 'react';
import { Plane } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
        <Plane className="absolute inset-0 m-auto h-6 w-6 text-blue-600 animate-pulse" />
      </div>
    </div>
  );
};

export default LoadingSpinner;
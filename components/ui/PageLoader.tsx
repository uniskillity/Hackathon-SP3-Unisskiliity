import React from 'react';
import Spinner from './Spinner';

const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center h-full min-h-[300px] w-full bg-white rounded-lg shadow-sm border border-gray-200">
    <Spinner size="lg" />
  </div>
);

export default PageLoader;

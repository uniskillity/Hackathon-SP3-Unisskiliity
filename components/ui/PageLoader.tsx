import React from 'react';
import Spinner from './Spinner';

const PageLoader: React.FC = () => (
  <div className="page-loader">
    <Spinner size="lg" />
  </div>
);

export default PageLoader;

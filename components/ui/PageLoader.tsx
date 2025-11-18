
import React from 'react';
import Spinner from './Spinner';

const PageLoader: React.FC = () => (
  <div className="page-loader">
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <Spinner size="lg" />
        <p style={{color: 'var(--color-slate-400)', fontSize: '0.9rem', fontWeight: 500}}>Loading...</p>
    </div>
  </div>
);

export default PageLoader;

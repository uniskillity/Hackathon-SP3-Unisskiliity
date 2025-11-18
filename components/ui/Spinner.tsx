import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
    const className = `spinner spinner-${size}`;
    return (
        <div className={className}></div>
    );
};

export default Spinner;

import React from 'react';
import styles from './Spinner.module.css';

interface SpinnerProps {
    size?: number;
    color?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 40, color = '#4CAF50' }) => {
    const style = {
        width: `${size}px`,
        height: `${size}px`,
        borderColor: `${color} transparent`,
    };

    return <div className={styles.spinner} style={style}></div>;
};

export default Spinner;

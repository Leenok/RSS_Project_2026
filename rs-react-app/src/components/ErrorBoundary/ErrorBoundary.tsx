import React from 'react';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        const { hasError, error } = this.state;
        const { children, fallback } = this.props;

        if (hasError) {
            return (
                <div className={styles.fallback}>
                    {fallback || (
                        <div>
                            <h2>Error</h2>
                            <p>{error?.message}</p>
                            <button onClick={this.handleReset} className={styles.resetButton}>
                                Update
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        return children;
    }
}

export default ErrorBoundary;

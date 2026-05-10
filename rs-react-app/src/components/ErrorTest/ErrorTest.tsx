import React from 'react';

interface ErrorTestProps {
    shouldCrash: boolean;
}

class ErrorTest extends React.Component<ErrorTestProps> {
    render() {
        if (this.props.shouldCrash) {
            throw new Error('Искусственная ошибка для тестирования ErrorBoundary');
        }
        return <div></div>;
    }
}

export default ErrorTest;

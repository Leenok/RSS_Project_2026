interface ErrorTestProps {
    shouldCrash: boolean;
}

const ErrorTest: React.FC<ErrorTestProps> = ({ shouldCrash }) => {
    if (shouldCrash) {
        throw new Error('Искусственная ошибка для тестирования ErrorBoundary');
    }
    return <div></div>;
};

export default ErrorTest;

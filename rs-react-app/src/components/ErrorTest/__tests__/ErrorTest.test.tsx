import { render, screen } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import ErrorTest from '../ErrorTest';
import ErrorBoundary from '../../ErrorBoundary/ErrorBoundary';

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ErrorTest component', () => {
    test('создает пустой div когда shouldCrash=false', () => {
        const { container } = render(<ErrorTest shouldCrash={false} />);
        expect(container.firstChild).toBeInTheDocument();
        expect(container.firstChild?.nodeName).toBe('DIV');
    });

    test('не выбрасывает ошибку при shouldCrash=false', () => {
        expect(() => render(<ErrorTest shouldCrash={false} />)).not.toThrow();
    });

    test('выбрасывает ошибку при shouldCrash=true', () => {
        expect(() => render(<ErrorTest shouldCrash={true} />)).toThrow(
            'Искусственная ошибка для тестирования ErrorBoundary'
        );
    });

    test('ErrorBoundary перехватывает ошибку от ErrorTest', () => {
        render(
            <ErrorBoundary>
                <ErrorTest shouldCrash={true} />
            </ErrorBoundary>
        );
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(
            screen.getByText('Искусственная ошибка для тестирования ErrorBoundary')
        ).toBeInTheDocument();
    });
});

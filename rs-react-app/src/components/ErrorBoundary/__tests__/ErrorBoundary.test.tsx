import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from '../ErrorBoundary';

const ThrowingComponent = ({ message = 'Test error' }: { message?: string }) => {
    throw new Error(message);
};

const NormalChild = () => <div>Всё работает нормально</div>;

beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe('ErrorBoundary — нормальный рендер', () => {
    test('рендерит children если ошибок нет', () => {
        render(
            <ErrorBoundary>
                <NormalChild />
            </ErrorBoundary>
        );
        expect(screen.getByText('Всё работает нормально')).toBeInTheDocument();
    });

    test('не показывает fallback UI когда ошибок нет', () => {
        render(
            <ErrorBoundary>
                <NormalChild />
            </ErrorBoundary>
        );
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
});

describe('ErrorBoundary — перехват ошибок', () => {
    test('показывает заголовок "Error" при ошибке в children', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText('Error')).toBeInTheDocument();
    });

    test('показывает сообщение ошибки', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent message="Конкретная ошибка" />
            </ErrorBoundary>
        );
        expect(screen.getByText('Конкретная ошибка')).toBeInTheDocument();
    });

    test('показывает кнопку "Update" в fallback UI', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();
    });

    test('не загружает children когда есть ошибка', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
                <NormalChild />
            </ErrorBoundary>
        );
        expect(screen.queryByText('Всё работает нормально')).not.toBeInTheDocument();
    });

    test('вызывает console.error при перехвате ошибки', () => {
        render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(console.error).toHaveBeenCalled();
    });
});

describe('ErrorBoundary — кастомный fallback', () => {
    test('показывает переданный fallback prop вместо дефолтного', () => {
        render(
            <ErrorBoundary fallback={<div>Кастомная страница ошибки</div>}>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(screen.getByText('Кастомная страница ошибки')).toBeInTheDocument();
    });

    test('не показывает дефолтный "Error" при кастомном fallback', () => {
        render(
            <ErrorBoundary fallback={<div>Custom</div>}>
                <ThrowingComponent />
            </ErrorBoundary>
        );
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });
});

describe('ErrorBoundary — сброс ошибки', () => {
    test('сбрасывает ошибку и снова создаем children после нажатия Update', async () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ThrowingComponent message="Разовая ошибка" />
            </ErrorBoundary>
        );

        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Разовая ошибка')).toBeInTheDocument();

        rerender(
            <ErrorBoundary>
                <NormalChild />
            </ErrorBoundary>
        );

        await userEvent.click(screen.getByRole('button', { name: /update/i }));

        expect(screen.getByText('Всё работает нормально')).toBeInTheDocument();
        expect(screen.queryByText('Error')).not.toBeInTheDocument();
    });

    test('после обновления страницы кнопка Update пропадает', async () => {
        const { rerender } = render(
            <ErrorBoundary>
                <ThrowingComponent />
            </ErrorBoundary>
        );

        expect(screen.getByRole('button', { name: /update/i })).toBeInTheDocument();

        rerender(
            <ErrorBoundary>
                <NormalChild />
            </ErrorBoundary>
        );

        await userEvent.click(screen.getByRole('button', { name: /update/i }));

        expect(screen.queryByRole('button', { name: /update/i })).not.toBeInTheDocument();
    });
});

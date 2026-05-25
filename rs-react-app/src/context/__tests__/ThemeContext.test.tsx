import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ThemeProvider, useTheme } from '../ThemeContext';

const ThemeConsumer: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <div>
            <span data-testid="theme" > {theme} </span>
            <button onClick={toggleTheme} > Toggle </button>
        </div >
    );
};

describe('ThemeContext', () => {
    test('provides light theme by default', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );
        expect(screen.getByTestId('theme').textContent).toBe(' light ');
    });

    test('toggleTheme switches to dark', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
        expect(screen.getByTestId('theme').textContent).toBe(' dark ');
    });

    test('toggleTheme switches back to light', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
        fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
        expect(screen.getByTestId('theme').textContent).toBe(' light ');
    });

    test('sets data-theme attribute on documentElement', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );
        expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    test('updates data-theme to dark on toggle', () => {
        render(
            <ThemeProvider>
                <ThemeConsumer />
            </ThemeProvider>
        );
        fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
        expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    test('useTheme throws outside of ThemeProvider', () => {
        const spy = console.error;
        console.error = () => { };
        expect(() => render(<ThemeConsumer />)).toThrow();
        console.error = spy;
    });
});
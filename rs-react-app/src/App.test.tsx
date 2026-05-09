import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App component', () => {
    test('renders button with initial count 0', () => {
        render(<App />);
        const button = screen.getByRole('button', { name: /Search/i });
        expect(button).toBeInTheDocument();
    });

});
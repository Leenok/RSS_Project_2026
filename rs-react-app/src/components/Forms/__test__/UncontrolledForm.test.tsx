import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import UncontrolledForm from '../UncontrolledForm';
import { useFormStore } from '../../../store/formStore';

beforeEach(() => {
    useFormStore.setState({ submissions: [] });
});

describe('UncontrolledForm', () => {
    it('renders all fields', () => {
        render(<UncontrolledForm onClose={() => { }} />);
        expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^gender/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/terms/i)).toBeInTheDocument();
    });

    it('shows validation errors on submit with empty form', async () => {
        render(<UncontrolledForm onClose={() => { }} />);
        fireEvent.click(screen.getByTestId('uc-submit'));
        await waitFor(() => {
            expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        });
    });

    it('shows error when name starts with lowercase', async () => {
        render(<UncontrolledForm onClose={() => { }} />);
        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'alice' } });
        fireEvent.click(screen.getByTestId('uc-submit'));
        await waitFor(() => {
            expect(screen.getByText(/first letter must be uppercase/i)).toBeInTheDocument();
        });
    });

    it('calls onClose after successful submission', async () => {
        const onClose = vi.fn();
        render(<UncontrolledForm onClose={onClose} />);

        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^age$/i), { target: { value: '25' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'female' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass@1' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass@1' } });
        fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'Germany' } });
        fireEvent.click(screen.getByLabelText(/terms/i));

        fireEvent.click(screen.getByTestId('uc-submit'));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });
});
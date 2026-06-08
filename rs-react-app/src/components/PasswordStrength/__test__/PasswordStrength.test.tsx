import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RHFForm from '../../Forms/RHFForm';
import { useFormStore } from '../../../store/formStore';

beforeEach(() => {
    useFormStore.setState({ submissions: [] });
});

describe('RHFForm', () => {
    it('renders all fields', () => {
        render(<RHFForm onClose={() => { }} />);
        expect(screen.getByLabelText(/^name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^age$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^gender/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/country/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/terms/i)).toBeInTheDocument();
    });

    it('submit button is disabled initially (invalid form)', () => {
        render(<RHFForm onClose={() => { }} />);
        expect(screen.getByTestId('rhf-submit')).toBeDisabled();
    });

    it('shows error when email is invalid', async () => {
        render(<RHFForm onClose={() => { }} />);
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'not-an-email' } });
        fireEvent.blur(screen.getByLabelText(/email/i));
        await waitFor(() => {
            expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
        });
    });

    it('shows error when passwords do not match', async () => {
        render(<RHFForm onClose={() => { }} />);
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass@1' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'different' } });
        fireEvent.blur(screen.getByLabelText(/confirm password/i));
        await waitFor(() => {
            expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('calls onClose after successful submission', async () => {
        const onClose = vi.fn();
        render(<RHFForm onClose={onClose} />);

        fireEvent.change(screen.getByLabelText(/^name/i), { target: { value: 'Alice' } });
        fireEvent.change(screen.getByLabelText(/^age$/i), { target: { value: '25' } });
        fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'alice@example.com' } });
        fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: 'female' } });
        fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'StrongPass@1' } });
        fireEvent.change(screen.getByLabelText(/confirm password/i), { target: { value: 'StrongPass@1' } });
        fireEvent.change(screen.getByTestId('country-input'), { target: { value: 'Germany' } });
        fireEvent.click(screen.getByLabelText(/terms/i));

        await waitFor(() => {
            expect(screen.getByTestId('rhf-submit')).not.toBeDisabled();
        });

        fireEvent.click(screen.getByTestId('rhf-submit'));
        await waitFor(() => {
            expect(onClose).toHaveBeenCalled();
        });
    });
});
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Modal from '../Modal';

describe('Modal', () => {
    it('does not render when isOpen is false', () => {
        render(<Modal isOpen={false} onClose={() => { }} title="Test"><div>content</div></Modal>);
        expect(screen.queryByTestId('modal')).not.toBeInTheDocument();
    });

    it('renders when isOpen is true', () => {
        render(<Modal isOpen={true} onClose={() => { }} title="Test Modal"><div>modal content</div></Modal>);
        expect(screen.getByTestId('modal')).toBeInTheDocument();
        expect(screen.getByText('Test Modal')).toBeInTheDocument();
        expect(screen.getByText('modal content')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} title="Test"><div>content</div></Modal>);
        fireEvent.click(screen.getByTestId('modal-close-button'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when overlay is clicked', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} title="Test"><div>content</div></Modal>);
        fireEvent.click(screen.getByTestId('modal-overlay'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when ESC key is pressed', () => {
        const onClose = vi.fn();
        render(<Modal isOpen={true} onClose={onClose} title="Test"><div>content</div></Modal>);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has proper aria attributes', () => {
        render(<Modal isOpen={true} onClose={() => { }} title="Accessible Modal"><div>content</div></Modal>);
        const overlay = screen.getByTestId('modal-overlay');
        expect(overlay).toHaveAttribute('role', 'dialog');
        expect(overlay).toHaveAttribute('aria-modal', 'true');
        expect(overlay).toHaveAttribute('aria-labelledby', 'modal-title');
    });
});
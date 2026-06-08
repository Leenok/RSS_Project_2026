import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    const overlayRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!isOpen) return;

        const previouslyFocused = document.activeElement as HTMLElement;
        firstFocusableRef.current?.focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
            previouslyFocused?.focus();
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) onClose();
    };

    return createPortal(
        <div
            className={styles.overlay}
            ref={overlayRef}
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            data-testid="modal-overlay"
        >
            <div className={styles.modal} data-testid="modal">
                <div className={styles.header}>
                    <h2 id="modal-title" className={styles.title}>
                        {title}
                    </h2>
                    <button
                        ref={firstFocusableRef}
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close modal"
                        type="button"
                        data-testid="modal-close-button"
                    >
                        ✕
                    </button>
                </div>
                <div className={styles.body}>{children}</div>
            </div>
        </div>,
        document.body
    );
};

export default Modal;
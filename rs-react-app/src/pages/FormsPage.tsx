import { useState } from 'react';
import Modal from '../components/Modal/Modal';
import UncontrolledForm from '../components/Forms/UncontrolledForm';
import RHFForm from '../components/Forms/RHFForm';
import SubmissionCard from '../components/SubmissionCard/SubmissionCard';
import { useFormStore } from '../store/formStore';
import styles from './FormsPage.module.css';

type ModalType = 'uncontrolled' | 'rhf' | null;

const FormsPage: React.FC = () => {
    const [openModal, setOpenModal] = useState<ModalType>(null);
    const { submissions } = useFormStore();

    const handleClose = () => setOpenModal(null);

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1>Form Examples</h1>
                <p>Two implementations: Uncontrolled form and React Hook Form</p>
            </header>

            <div className={styles.buttons}>
                <button
                    type="button"
                    className={`${styles.openBtn} ${styles.ucBtn}`}
                    onClick={() => setOpenModal('uncontrolled')}
                    data-testid="open-uncontrolled"
                >
                    Open Uncontrolled Form
                </button>
                <button
                    type="button"
                    className={`${styles.openBtn} ${styles.rhfBtn}`}
                    onClick={() => setOpenModal('rhf')}
                    data-testid="open-rhf"
                >
                    Open React Hook Form
                </button>
            </div>

            {submissions.length > 0 && (
                <section className={styles.submissions}>
                    <h2 className={styles.submissionsTitle}>
                        Submissions ({submissions.length})
                    </h2>
                    <div className={styles.grid}>
                        {submissions.map((sub) => (
                            <SubmissionCard key={sub.id} submission={sub} />
                        ))}
                    </div>
                </section>
            )}

            <Modal
                isOpen={openModal === 'uncontrolled'}
                onClose={handleClose}
                title="Uncontrolled Form"
            >
                <UncontrolledForm onClose={handleClose} />
            </Modal>

            <Modal
                isOpen={openModal === 'rhf'}
                onClose={handleClose}
                title="React Hook Form"
            >
                <RHFForm onClose={handleClose} />
            </Modal>
        </div>
    );
};

export default FormsPage;
import { useEffect, useState } from 'react';
import type { FormSubmission } from '../../types/form';
import styles from './SubmissionCard.module.css';

interface Props {
    submission: FormSubmission;
}

const SubmissionCard: React.FC<Props> = ({ submission }) => {
    const [highlight, setHighlight] = useState(submission.isNew ?? false);

    useEffect(() => {
        if (!submission.isNew) return;
        const timer = setTimeout(() => setHighlight(false), 3000);
        return () => clearTimeout(timer);
    }, [submission.isNew]);

    return (
        <div className={`${styles.card} ${highlight ? styles.newCard : ''}`} data-testid="submission-card">
            <div className={styles.header}>
                {submission.imageBase64 ? (
                    <img src={submission.imageBase64} alt={submission.name} className={styles.avatar} />
                ) : (
                    <div className={styles.avatarPlaceholder}>{submission.name.charAt(0).toUpperCase()}</div>
                )}
                <div>
                    <div className={styles.name}>{submission.name}</div>
                    <div className={styles.badge} data-source={submission.source}>
                        {submission.source === 'rhf' ? 'React Hook Form' : 'Uncontrolled'}
                    </div>
                </div>
            </div>
            <dl className={styles.details}>
                <div className={styles.row}>
                    <dt>Age</dt>
                    <dd>{submission.age}</dd>
                </div>
                <div className={styles.row}>
                    <dt>Email</dt>
                    <dd>{submission.email}</dd>
                </div>
                <div className={styles.row}>
                    <dt>Gender</dt>
                    <dd>{submission.gender}</dd>
                </div>
                <div className={styles.row}>
                    <dt>Country</dt>
                    <dd>{submission.country}</dd>
                </div>
            </dl>
        </div>
    );
};

export default SubmissionCard;
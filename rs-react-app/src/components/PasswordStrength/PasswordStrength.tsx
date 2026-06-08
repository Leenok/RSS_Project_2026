import { getPasswordStrength } from '../../utils/formUtils';
import styles from './PasswordStrength.module.css';

interface Props {
    password: string;
}

const PasswordStrength: React.FC<Props> = ({ password }) => {
    if (!password) return null;

    const { score, label, color, checks } = getPasswordStrength(password);

    return (
        <div className={styles.container} data-testid="password-strength">
            <div className={styles.bars}>
                {[0, 1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className={styles.bar}
                        style={{ background: i < score ? color : '#e5e7eb' }}
                    />
                ))}
            </div>
            <span className={styles.label} style={{ color }}>
                {label}
            </span>
            <ul className={styles.checks}>
                <li className={checks.hasNumber ? styles.pass : styles.fail}>1 number</li>
                <li className={checks.hasUppercase ? styles.pass : styles.fail}>1 uppercase letter</li>
                <li className={checks.hasLowercase ? styles.pass : styles.fail}>1 lowercase letter</li>
                <li className={checks.hasSpecial ? styles.pass : styles.fail}>1 special character</li>
            </ul>
        </div>
    );
};

export default PasswordStrength;
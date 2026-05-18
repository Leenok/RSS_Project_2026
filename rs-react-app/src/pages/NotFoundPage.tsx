import { Link } from 'react-router-dom';
import styles from './NotFoundPage.module.css';

const NotFoundPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.code}>404</div>
            <h1 className={styles.title}>Page Not Found</h1>
            <p className={styles.desc}>
                Oops! The page you are looking for does not exist or has been moved.
            </p>
            <Link to="/" className={styles.homeLink}>
                ← Go back to home
            </Link>
        </div>
    );
};

export default NotFoundPage;

import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.css';

const NavBar: React.FC = () => {
    return (
        <nav className={styles.nav}>
            <NavLink
                to="/"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
                end
            >
                🏠 Home
            </NavLink>
            <NavLink
                to="/about"
                className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            >
                ℹ️ About
            </NavLink>
        </nav>
    );
};

export default NavBar;

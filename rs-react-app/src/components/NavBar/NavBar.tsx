import { NavLink } from 'react-router-dom';
import { useTheme } from '../../context/Themecontext';
import styles from './NavBar.module.css';

const NavBar: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className={styles.nav}>
            <div className={styles.links}>
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
            </div>
            <button
                type="button"
                className={styles.themeToggle}
                onClick={toggleTheme}
                aria-label="Toggle theme"
            >
                {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </button>
        </nav>
    );
};

export default NavBar;

import { Link } from 'react-router-dom';
import styles from './AboutPage.module.css';

const AboutPage: React.FC = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>About</h1>

            <section className={styles.card}>
                <h2>Author: Leenok</h2>
                <p>This application was built as part of the RSS School React course.</p>
                <ul className={styles.info}>
                    <li><strong>Project:</strong> RSS React App — Pokémon Search</li>
                    <li><strong>Stack:</strong> React 19, TypeScript, Vite, React Router v7</li>
                    <li><strong>API:</strong> <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokéAPI</a></li>
                </ul>
            </section>

            <section className={styles.card}>
                <h2>Course</h2>
                <p>
                    Built for the{' '}
                    <a
                        href="https://rs.school/react/"
                        target="_blank"
                        rel="noreferrer"
                        className={styles.link}
                    >
                        RS School React Course
                    </a>
                    . RS School is a free community-based online education program run by the Rolling Scopes developer community.
                </p>
            </section>



            <Link to="/" className={styles.backLink}>
                ← Back to home
            </Link>
        </div>

    );
};

export default AboutPage;

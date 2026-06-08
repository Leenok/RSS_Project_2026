import { useCallback } from 'react';
import { useSearchParams, Outlet, useNavigate, useMatch } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import PokemonList from '../components/PokemonList/PokemonList';
import Pagination from '../components/Pagination/Pagination';
import ErrorTest from '../components/ErrorTest/ErrorTest';
import { usePokemonSearch } from '../hooks/usePokemonSearch';
import styles from './MainPage.module.css';

const MainPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const detailMatch = useMatch('/details/:detailId');
    const hasDetail = Boolean(detailMatch);

    const urlPage = parseInt(searchParams.get('page') ?? '1', 10) || 1;

    const handlePageChange = useCallback(
        (page: number) => {
            setSearchParams((prev) => {
                const next = new URLSearchParams(prev);
                next.set('page', String(page));
                return next;
            });
        },
        [setSearchParams]
    );

    const {
        paginatedPokemons,
        loading,
        error,
        currentPage,
        totalPages,
        handleSearch,
        setPage,
        refresh,
    } = usePokemonSearch(urlPage, handlePageChange);

    const handleSelectPokemon = useCallback(
        (id: number) => {
            const page = searchParams.get('page') ?? '1';
            navigate(`/details/${id}?page=${page}`);
        },
        [navigate, searchParams]
    );

    const handleCloseDetail = useCallback(() => {
        const page = searchParams.get('page') ?? '1';
        navigate(`/?page=${page}`);
    }, [navigate, searchParams]);

    return (
        <div className={`${styles.layout} ${hasDetail ? styles.splitLayout : ''}`}>
            <div
                className={styles.leftPanel}
                onClick={hasDetail ? handleCloseDetail : undefined}
                data-testid="main-panel"
            >
                <header className={styles.header}>
                    <h1>Search Pokémon</h1>
                    <p>Find your favorite Pokémon by name!</p>
                </header>

                <main className={styles.main} onClick={(e) => e.stopPropagation()}>
                    <SearchBar onSearch={handleSearch} />
                    <ErrorTest shouldCrash={false} />

                    <button
                        type="button"
                        className={styles.refreshButton}
                        onClick={refresh}
                        disabled={loading}
                        data-testid="refresh-button"
                    >
                        {loading ? 'Loading…' : '🔄 Refresh'}
                    </button>

                    <PokemonList
                        pokemons={paginatedPokemons}
                        loading={loading}
                        error={error}
                        onSelectPokemon={handleSelectPokemon}
                    />

                    {!loading && !error && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    )}
                </main>

                <footer>
                    <button
                        type="button"
                        className={styles.testErrorButton}
                        onClick={() => {
                            throw new Error('Тестовая ошибка приложения');
                        }}
                    >
                        Test error (for demonstration)
                    </button>
                </footer>
            </div>

            {hasDetail && (
                <div className={styles.rightPanel} onClick={(e) => e.stopPropagation()}>
                    <Outlet />
                </div>
            )}
        </div>
    );
};

export default MainPage;
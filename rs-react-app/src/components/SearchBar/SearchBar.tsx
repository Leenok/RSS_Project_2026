import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import styles from './SearchBar.module.css';
// import { useLocalStorage } from '../../hooks/useLocalStorage';

const STORAGE_KEY = 'pokemon_search_query';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    // const [savedQuery] = useLocalStorage<string>(STORAGE_KEY, '');
    // const [searchQuery, setSearchQuery] = useState<string>(savedQuery);

    // useEffect(() => {
    //     if (savedQuery) {
    //         setSearchQuery(savedQuery);
    //         onSearch(savedQuery);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        // setSearchQuery(e.target.value);
    };

    const handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        // const trimmed = searchQuery.trim();
        // onSearch(trimmed);
    };

    return (
        <div className={styles.searchContainer}>
            <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                    type="text"
                    placeholder="Input name..."
                    // value={searchQuery}
                    onChange={handleSearchChange}
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchBar;

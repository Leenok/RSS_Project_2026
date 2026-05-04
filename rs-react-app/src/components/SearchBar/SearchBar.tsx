import React, { type ChangeEvent, type FormEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

class SearchBar extends React.Component<SearchBarProps> {
    state = {
        searchQuery: '',
    };

    handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchQuery: e.target.value });
    };

    handleSearchSubmit = (e: FormEvent) => {
        e.preventDefault();
        this.props.onSearch(this.state.searchQuery.trim());
    };

    render() {
        return (
            <div className={styles.searchContainer}>
                <form onSubmit={this.handleSearchSubmit} className={styles.searchForm}>
                    <input
                        type="text"
                        placeholder="Input name..."
                        value={this.state.searchQuery}
                        onChange={this.handleSearchChange}
                        className={styles.searchInput}
                    />
                    <button
                        type="submit"
                        className={styles.searchButton}
                    >
                        Search
                    </button>
                </form>
            </div>
        );
    }
}

export default SearchBar;

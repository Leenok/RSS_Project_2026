import React, { type ChangeEvent } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
    onSearch: (query: string) => void;
}

class SearchBar extends React.Component<SearchBarProps> {
    state = {
        searchQuery: ''
    };

    handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        this.setState({ searchQuery: query }, () => {
            this.props.onSearch(query);
        });
    };

    render() {
        return (
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    placeholder="Input name ..."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchChange}
                    className={styles.searchInput}
                />
            </div>
        );
    }
}

export default SearchBar;

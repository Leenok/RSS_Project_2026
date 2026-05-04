import React, { type ChangeEvent } from 'react';
// import styles from '../SearchSection/'

interface SearchSectionProps {
    onSearch: (query: string) => void;
    onLimitChange: (limit: number) => void;
}

class SearchSection extends React.Component<SearchSectionProps> {
    state = {
        searchQuery: '',
        limit: 20
    };

    handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        this.setState({ searchQuery: e.target.value }, () => {
            this.props.onSearch(this.state.searchQuery);
        });
    };

    handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const limit = parseInt(e.target.value, 10);
        this.setState({ limit }, () => {
            this.props.onLimitChange(this.state.limit);
        });
    };

    render() {
        return (
            <div >
                {/* className={styles.searchContainer} */}
                <input
                    type="text"
                    placeholder="Поиск покемонов..."
                    value={this.state.searchQuery}
                    onChange={this.handleSearchChange}
                // className={styles.searchInput}
                />
                <select
                    value={this.state.limit}
                    onChange={this.handleLimitChange}
                // className={styles.select}
                >
                    <option value={10}>10 покемонов</option>
                    <option value={20}>20 покемонов</option>
                    <option value={50}>50 покемонов</option>
                </select>
            </div>
        );
    }
}

export default SearchSection;
import { useCallback } from 'react';
import { useSearchParams, Outlet, useNavigate, useMatch } from 'react-router-dom';
import SearchBar from '../components/SearchBar/SearchBar';
import PokemonList from '../components/PokemonList/PokemonList';
import ErrorTest from '../components/ErrorTest/ErrorTest';

import styles from './MainPage.module.css';

// import Pagination from '../components/Pagination/Pagination';
// import ErrorTest from '../components/ErrorTest/ErrorTest';

// import type { PokemonDetail } from '../types/pokemon';

// import { fetchPokemonList, fetchPokemonDetail } from '../services/pokemonApi';



const MainPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    // Match the nested details route to know if detail panel is open
    const detailMatch = useMatch('/details/:detailId');
    const hasDetail = Boolean(detailMatch);

    const handlePageChange = useCallback(
        (page: number) => {
            setSearchParams(prev => {
                const next = new URLSearchParams(prev);
                next.set('page', String(page));
                return next;
            });
        },
        [setSearchParams]
    );

    // const {
    //     paginatedPokemons,
    //     loading,
    //     error,
    //     currentPage,
    //     totalPages,
    //     handleSearch,
    //     setPage,
    // } = usePokemonSearch(urlPage, handlePageChange);

    return (
        <div className={`${styles.layout} ${hasDetail ? styles.splitLayout : ''}`}>
            <header >
                <h1>Search Pokémon</h1>
                <p>Find your favorite Pokémon by name!</p>
            </header>


            <main className={styles.main} onClick={e => e.stopPropagation()}>
                <SearchBar onSearch={''} />
                <ErrorTest shouldCrash={false} />

                <PokemonList
                    pokemons={[]}
                    loading={true}
                    error={false}
                    onSelectPokemon={''}
                />

                {/* {!loading && !error && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                )} */}
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
    )
}
export default MainPage;

// class App extends React.Component {
//     state = {
//         allPokemons: [] as PokemonDetail[],
//         filteredPokemons: [] as PokemonDetail[],
//         loading: false,
//         error: null as string | null,
//         searchQuery: '',
//         limit: 50,
//         shouldCrash: false
//     };

//     componentDidMount() {
//         this.loadAllPokemon();
//     }

//     loadAllPokemon = async () => {
//         this.setState({ loading: true, error: null });

//         try {
//             const listData = await fetchPokemonList(this.state.limit);

//             const results = listData.results;
//             const batchSize = 10;
//             const detailedData: PokemonDetail[] = [];

//             for (let i = 0; i < results.length; i += batchSize) {
//                 const batch = results.slice(i, i + batchSize);
//                 const batchDetails = await Promise.all(
//                     batch.map(pokemon => fetchPokemonDetail(pokemon.name))
//                 );
//                 detailedData.push(...batchDetails);
//             }

//             this.setState({
//                 allPokemons: detailedData,
//                 filteredPokemons: detailedData,
//                 loading: false
//             });
//         } catch (error) {
//             this.setState({
//                 error: 'Error loading Pokemon',
//                 loading: false
//             });
//             console.error('Error loading pokemon:', error);
//         }
//     };

//     handleSearch = (query: string) => {
//         this.setState({ searchQuery: query });

//         if (!query.trim()) {
//             this.setState({ filteredPokemons: this.state.allPokemons });
//             return;
//         }

//         const lowerCaseQuery = query.toLowerCase();
//         const filtered = this.state.allPokemons.filter(pokemon =>
//             pokemon.name.toLowerCase().includes(lowerCaseQuery)
//         );

//         this.setState({ filteredPokemons: filtered });
//     };

//     triggerTestError = () => {
//         this.setState({ shouldCrash: true });
//         throw new Error('Тестовая ошибка приложения');
//     };

//     render() {
//         const { filteredPokemons, loading, error } = this.state;

//         return (
//             <div className="App">
//                 <NavBar />
//                 <header className="App-header">
//                     <h1>Search pokemons</h1>
//                     <p>Find your favorite Pokemon by name!</p>
//                 </header>
//                 <main className="App-main">
//                     <SearchBar onSearch={this.handleSearch} />
//                     <ErrorTest shouldCrash={this.state.shouldCrash} />
//                     <PokemonList
//                         pokemons={filteredPokemons}
//                         loading={loading}
//                         error={error}
//                     />
//                 </main>
//                 <footer>
//                     <button
//                         type="button"
//                         onClick={this.triggerTestError}
//                         className="test-error-button"
//                     >
//                         Test error (for demonstration)
//                     </button>
//                 </footer>
//             </div>
//         );
//     }
// }

// export default App;
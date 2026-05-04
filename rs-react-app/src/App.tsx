import React from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import PokemonList from './components/PokemonList/PokemonList';
import type { PokemonDetail } from './types/pokemon';
import { fetchPokemonList, fetchPokemonDetail } from './services/pokemonApi';
import './App.css';

class App extends React.Component {
  state = {
    allPokemons: [] as PokemonDetail[],
    filteredPokemons: [] as PokemonDetail[],
    loading: false,
    error: null as string | null,
    searchQuery: ''
  };

  componentDidMount() {
    this.loadAllPokemon();
  }

  loadAllPokemon = async () => {
    this.setState({ loading: true, error: null });

    try {
      const listData = await fetchPokemonList(50);
      const detailedPromises = listData.results.map(pokemon =>
        fetchPokemonDetail(pokemon.name)
      );
      const detailedData = await Promise.all(detailedPromises);

      this.setState({
        allPokemons: detailedData,
        filteredPokemons: detailedData,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: 'Ошибка при загрузке покемонов',
        loading: false
      });
      console.error('Error loading pokemon:', error);
    }
  };

  handleSearch = async (query: string) => {
    this.setState({ searchQuery: query });

    if (!query.trim()) {
      this.setState({ filteredPokemons: this.state.allPokemons });
      return;
    }

    const lowerCaseQuery = query.toLowerCase();
    const filtered = this.state.allPokemons.filter(pokemon =>
      pokemon.name.toLowerCase().includes(lowerCaseQuery)
    );

    this.setState({ filteredPokemons: filtered });
  };

  render() {
    const { filteredPokemons, loading, error } = this.state;

    return (
      <div className="App">
        <header className="App-header">
          <h1> Search pokemons</h1>
          <p>Find your favorite Pokemon by name!</p>
        </header>

        <main className="App-main">
          <SearchBar onSearch={this.handleSearch} />
          <PokemonList
            pokemons={filteredPokemons}
            loading={loading}
            error={error}
          />
        </main>
      </div>
    );
  }
}

export default App;

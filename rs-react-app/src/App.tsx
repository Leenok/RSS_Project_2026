// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import SearchSection from './components/SearchSection/SearchSection'
// import PokemonList from './components/PokemonList/PokemonList'
import React from 'react';

import { fetchPokemonList } from './services/pokemonApi';
import { type PokemonListResponse } from './types/pokemon';
// import { fetchPokemonList } from './services/pokemonApi';
// import './App.css'


class App extends React.Component {
  state = {
    pokemons: [],
    loading: false,
    error: null as string | null,
    limit: 20
  };

  componentDidMount() {
    this.loadPokemon();
  }

  loadPokemon = async (limit: number = this.state.limit) => {
    this.setState({ loading: true, error: null });

    try {
      const data: PokemonListResponse = await fetchPokemonList(limit);
      this.setState({
        pokemons: data.results,
        loading: false
      });
    } catch (error) {
      this.setState({
        error: 'Ошибка при загрузке покемонов',
        loading: false
      });
      console.error('Error fetching pokemon:', error);
    }
  };

  handleLimitChange = (limit: number) => {
    this.setState({ limit }, () => {
      this.loadPokemon(limit);
    });
  };

  render() {
    const { pokemons, loading, error } = this.state;

    return (
      <div className="app">
        <h1>Покемон Поиск</h1>

        {error && <div className="error">{error}</div>}

        <div>
          <button
            onClick={() => this.handleLimitChange(10)}
            disabled={this.state.limit === 10}
          >
            10 покемонов
          </button>
          <button
            onClick={() => this.handleLimitChange(20)}
            disabled={this.state.limit === 20}
          >
            20 покемонов
          </button>
          <button
            onClick={() => this.handleLimitChange(50)}
            disabled={this.state.limit === 50}
          >
            50 покемонов
          </button>
        </div>

        {loading ? (
          <div>Загрузка...</div>
        ) : (
          <ul>
            {pokemons.map((pokemon, index) => (
              <li key={pokemon.name}>
                {index + 1}. {pokemon.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
}

export default App;

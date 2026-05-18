// src/App.tsx
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import NavBar from './components/NavBar/NavBar';
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';

import React from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import PokemonList from './components/PokemonList/PokemonList';
import type { PokemonDetail } from './types/pokemon';
import { fetchPokemonList, fetchPokemonDetail } from './services/pokemonApi';
import ErrorTest from './components/ErrorTest/ErrorTest';
import './App.css';

const RootLayout: React.FC = () => (
  <div>
    <NavBar />
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: 'about/',
        element: <AboutPage />,
      },

    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

// class App extends React.Component {
//   state = {
//     allPokemons: [] as PokemonDetail[],
//     filteredPokemons: [] as PokemonDetail[],
//     loading: false,
//     error: null as string | null,
//     searchQuery: '',
//     limit: 50,
//     shouldCrash: false
//   };

//   componentDidMount() {
//     this.loadAllPokemon();
//   }

//   loadAllPokemon = async () => {
//     this.setState({ loading: true, error: null });

//     try {
//       const listData = await fetchPokemonList(this.state.limit);

//       const results = listData.results;
//       const batchSize = 10;
//       const detailedData: PokemonDetail[] = [];

//       for (let i = 0; i < results.length; i += batchSize) {
//         const batch = results.slice(i, i + batchSize);
//         const batchDetails = await Promise.all(
//           batch.map(pokemon => fetchPokemonDetail(pokemon.name))
//         );
//         detailedData.push(...batchDetails);
//       }

//       this.setState({
//         allPokemons: detailedData,
//         filteredPokemons: detailedData,
//         loading: false
//       });
//     } catch (error) {
//       this.setState({
//         error: 'Error loading Pokemon',
//         loading: false
//       });
//       console.error('Error loading pokemon:', error);
//     }
//   };

//   handleSearch = (query: string) => {
//     this.setState({ searchQuery: query });

//     if (!query.trim()) {
//       this.setState({ filteredPokemons: this.state.allPokemons });
//       return;
//     }

//     const lowerCaseQuery = query.toLowerCase();
//     const filtered = this.state.allPokemons.filter(pokemon =>
//       pokemon.name.toLowerCase().includes(lowerCaseQuery)
//     );

//     this.setState({ filteredPokemons: filtered });
//   };

//   triggerTestError = () => {
//     this.setState({ shouldCrash: true });
//     throw new Error('Тестовая ошибка приложения');
//   };

//   render() {
//     const { filteredPokemons, loading, error } = this.state;

//     return (
//       <div className="App">
//         <NavBar />
//         <header className="App-header">
//           <h1>Search pokemons</h1>
//           <p>Find your favorite Pokemon by name!</p>
//         </header>
//         <main className="App-main">
//           <SearchBar onSearch={this.handleSearch} />
//           <ErrorTest shouldCrash={this.state.shouldCrash} />
//           <PokemonList
//             pokemons={filteredPokemons}
//             loading={loading}
//             error={error}
//           />
//         </main>
//         <footer>
//           <button
//             type="button"
//             onClick={this.triggerTestError}
//             className="test-error-button"
//           >
//             Test error (for demonstration)
//           </button>
//         </footer>
//       </div>
//     );
//   }
// }

// export default App;
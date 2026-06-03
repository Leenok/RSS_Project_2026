import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import App from './App';
import * as pokemonApi from './services/pokemonApi';

vi.mock('./services/pokemonApi');

const mockList = {
    count: 2,
    next: null,
    previous: null,
    results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ],
};

const bulbasaur = {
    id: 1,
    name: 'bulbasaur',
    sprites: { front_default: 'https://example.com/bulbasaur.png' },
    types: [{ type: { name: 'grass' } }],
};

const charmander = {
    id: 4,
    name: 'charmander',
    sprites: { front_default: 'https://example.com/charmander.png' },
    types: [{ type: { name: 'fire' } }],
};

function renderApp() {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        createElement(QueryClientProvider, { client: qc }, <App />)
    );
}

beforeEach(() => {
    localStorage.clear();
    vi.mocked(pokemonApi.fetchPokemonList).mockResolvedValue(mockList);
    vi.mocked(pokemonApi.fetchPokemonDetail)
        .mockResolvedValueOnce(bulbasaur)
        .mockResolvedValueOnce(charmander);
});

afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
});

const waitForPokemons = () =>
    waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());

describe('App — rendering', () => {
    test('renders heading "Search Pokémon"', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.getByText('Search Pokémon')).toBeInTheDocument();
    });

    test('renders subtitle', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.getByText('Find your favorite Pokémon by name!')).toBeInTheDocument();
    });

    test('renders search bar', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.getByPlaceholderText('Input name...')).toBeInTheDocument();
    });

    test('renders Test error button', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.getByRole('button', { name: /test error/i })).toBeInTheDocument();
    });

    test('renders refresh button', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.getByTestId('refresh-button')).toBeInTheDocument();
    });
});

describe('App — data loading', () => {
    test('shows spinner during loading', async () => {
        renderApp();
        expect(screen.getByText(/Загрузка покемонов/i)).toBeInTheDocument();
        await waitForPokemons();
    });

    test('calls fetchPokemonList on mount', async () => {
        renderApp();
        await waitFor(() => expect(pokemonApi.fetchPokemonList).toHaveBeenCalledTimes(1));
        await waitForPokemons();
    });

    test('calls fetchPokemonDetail for each pokemon', async () => {
        renderApp();
        await waitFor(() => expect(pokemonApi.fetchPokemonDetail).toHaveBeenCalledTimes(2));
        expect(pokemonApi.fetchPokemonDetail).toHaveBeenCalledWith('bulbasaur');
        expect(pokemonApi.fetchPokemonDetail).toHaveBeenCalledWith('charmander');
    });

    test('displays pokemons after loading', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.getByText('#4 charmander')).toBeInTheDocument();
    });

    test('hides spinner after loading', async () => {
        renderApp();
        await waitForPokemons();
        expect(screen.queryByText(/Загрузка покемонов/i)).not.toBeInTheDocument();
    });
});

describe('App — API error handling', () => {
    test('shows error message on fetchPokemonList failure', async () => {
        vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValueOnce(new Error('Network error'));
        renderApp();
        await waitFor(() =>
            expect(screen.getByText(/Network error/i)).toBeInTheDocument()
        );
    });

    test('hides spinner after error', async () => {
        vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValueOnce(new Error('fail'));
        renderApp();
        await waitFor(() =>
            expect(screen.queryByText(/Загрузка покемонов/i)).not.toBeInTheDocument()
        );
    });
});

describe('App — search and filtering', () => {
    test('filters pokemons by search query', async () => {
        renderApp();
        await waitForPokemons();

        await userEvent.type(screen.getByPlaceholderText('Input name...'), 'char');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.queryByText('#1 bulbasaur')).not.toBeInTheDocument();
        expect(screen.getByText('#4 charmander')).toBeInTheDocument();
    });

    test('search is case-insensitive', async () => {
        renderApp();
        await waitForPokemons();

        await userEvent.type(screen.getByPlaceholderText('Input name...'), 'BULBA');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
    });

    test('shows all pokemons when search is cleared', async () => {
        renderApp();
        await waitForPokemons();

        const input = screen.getByPlaceholderText('Input name...');
        await userEvent.type(input, 'char');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));
        await userEvent.clear(input);
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('#4 charmander')).toBeInTheDocument();
    });

    test('shows "no pokemon found" when nothing matches', async () => {
        renderApp();
        await waitForPokemons();

        await userEvent.type(screen.getByPlaceholderText('Input name...'), 'xyznonexistent');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText(/Покемоны не найдены/i)).toBeInTheDocument();
    });
});

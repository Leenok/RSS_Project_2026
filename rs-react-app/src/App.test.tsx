import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest';
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
    test('рендерит заголовок "Search pokemons"', async () => {
        render(<App />);
        await waitForPokemons();
        expect(screen.getByText('Search pokemons')).toBeInTheDocument();
    });

    test('рендерит подзаголовок', async () => {
        render(<App />);
        await waitForPokemons();
        expect(
            screen.getByText('Find your favorite Pokemon by name!')
        ).toBeInTheDocument();
    });

    test('рендерит строку поиска', async () => {
        render(<App />);
        await waitForPokemons();
        expect(screen.getByPlaceholderText('Input name...')).toBeInTheDocument();
    });

    test('рендерит кнопку Test error', async () => {
        render(<App />);
        await waitForPokemons();
        expect(
            screen.getByRole('button', { name: /test error/i })
        ).toBeInTheDocument();
    });
});


describe('App — загрузка данных', () => {
    test('показывает спиннер во время загрузки', async () => {
        render(<App />);
        // await waitForPokemons();
        expect(screen.getByText(/Загрузка покемонов/i)).toBeInTheDocument();
        await waitForPokemons();
    });

    test('вызывает fetchPokemonList при монтировании', async () => {
        render(<App />);
        await waitFor(() =>
            expect(pokemonApi.fetchPokemonList).toHaveBeenCalledTimes(1)
        );
        await waitForPokemons()
    });

    test('вызывает fetchPokemonDetail для каждого покемона из списка', async () => {
        render(<App />);
        await waitFor(() =>
            expect(pokemonApi.fetchPokemonDetail).toHaveBeenCalledTimes(2)
        );
        expect(pokemonApi.fetchPokemonDetail).toHaveBeenCalledWith('bulbasaur');
        expect(pokemonApi.fetchPokemonDetail).toHaveBeenCalledWith('charmander');
    });

    test('отображает покемонов после загрузки', async () => {
        render(<App />);
        await waitForPokemons();
        expect(screen.getByText('#4 charmander')).toBeInTheDocument();
    });

    test('скрывает спиннер после загрузки', async () => {
        render(<App />);
        await waitForPokemons();
        expect(screen.queryByText(/Загрузка покемонов/i)).not.toBeInTheDocument();
    });
});


describe('App — обработка ошибок API', () => {
    test('показывает "Error loading Pokemon" при ошибке fetchPokemonList', async () => {
        vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValueOnce(
            new Error('Network error')
        );
        render(<App />);
        await waitFor(() =>
            expect(screen.getByText('Error loading Pokemon')).toBeInTheDocument()
        );
    });

    test('скрывает спиннер после ошибки', async () => {
        vi.mocked(pokemonApi.fetchPokemonList).mockRejectedValueOnce(
            new Error('fail')
        );
        render(<App />);
        await waitFor(() =>
            expect(screen.queryByText(/Загрузка покемонов/i)).not.toBeInTheDocument()
        );
    });
});


describe('App — поиск и фильтрация', () => {
    test('фильтрует покемонов по поисковому запросу', async () => {
        render(<App />);
        await waitForPokemons();

        await userEvent.type(screen.getByPlaceholderText('Input name...'), 'char');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.queryByText('#1 bulbasaur')).not.toBeInTheDocument();
        expect(screen.getByText('#4 charmander')).toBeInTheDocument();
    });

    test('поиск не чувствителен к регистру', async () => {
        render(<App />);
        await waitForPokemons();

        await userEvent.type(screen.getByPlaceholderText('Input name...'), 'BULBA');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
    });

    test('показывает всех покемонов при очистке поиска', async () => {
        render(<App />);
        await waitForPokemons();

        const input = screen.getByPlaceholderText('Input name...');
        await userEvent.type(input, 'char');
        await userEvent.click(screen.getByRole('button', { name: /search/i }));
        await userEvent.clear(input);
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument();
        expect(screen.getByText('#4 charmander')).toBeInTheDocument();
    });

    test('показывает "Покемоны не найдены" если ничего не найдено', async () => {
        render(<App />);
        await waitForPokemons();

        await userEvent.type(
            screen.getByPlaceholderText('Input name...'),
            'xyznonexistent'
        );
        await userEvent.click(screen.getByRole('button', { name: /search/i }));

        expect(screen.getByText(/Покемоны не найдены/i)).toBeInTheDocument();
    });
});

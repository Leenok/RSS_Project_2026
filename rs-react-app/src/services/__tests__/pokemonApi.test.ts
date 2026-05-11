import { vi, describe, test, expect, beforeEach } from 'vitest';
import { fetchPokemonList, fetchPokemonDetail } from '../pokemonApi';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const makeOkResponse = (data: unknown) => ({
    ok: true,
    json: async () => data,
});

const makeFailResponse = () => ({ ok: false });

const listFixture = {
    count: 2,
    next: null,
    previous: null,
    results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'charmander', url: 'https://pokeapi.co/api/v2/pokemon/4/' },
    ],
};

const detailFixture = {
    id: 25,
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    types: [{ type: { name: 'electric' } }],
};

beforeEach(() => {
    mockFetch.mockClear();
});

describe('fetchPokemonList', () => {
    test('делает запрос к правильному URL с переданным limit', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(listFixture));
        await fetchPokemonList(20);
        expect(mockFetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon?limit=20'
        );
    });

    test('использует дефолтный limit=200 если аргумент не передан', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(listFixture));
        await fetchPokemonList();
        expect(mockFetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon?limit=200'
        );
    });

    test('возвращает распарсенные данные при успешном ответе', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(listFixture));
        const result = await fetchPokemonList(2);
        expect(result).toEqual(listFixture);
    });

    test('делает ровно один запрос', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(listFixture));
        await fetchPokemonList(10);
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test('выбрасывает ошибку если response.ok = false', async () => {
        mockFetch.mockResolvedValueOnce(makeFailResponse());
        await expect(fetchPokemonList()).rejects.toThrow(
            'Ошибка загрузки списка покемонов'
        );
    });

    test('пробрасывает сетевую ошибку (reject fetch)', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network failure'));
        await expect(fetchPokemonList()).rejects.toThrow('Network failure');
    });
});

describe('fetchPokemonDetail', () => {
    test('делает запрос к правильному URL с именем покемона', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(detailFixture));
        await fetchPokemonDetail('pikachu');
        expect(mockFetch).toHaveBeenCalledWith(
            'https://pokeapi.co/api/v2/pokemon/pikachu'
        );
    });

    test('возвращает детали покемона при успешном ответе', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(detailFixture));
        const result = await fetchPokemonDetail('pikachu');
        expect(result).toEqual(detailFixture);
    });

    test('выбрасывает ошибку с именем покемона если response.ok = false', async () => {
        mockFetch.mockResolvedValueOnce(makeFailResponse());
        await expect(fetchPokemonDetail('missingno')).rejects.toThrow(
            'Покемон "missingno" не найден'
        );
    });

    test('пробрасывает сетевую ошибку', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Connection refused'));
        await expect(fetchPokemonDetail('pikachu')).rejects.toThrow('Connection refused');
    });

    test('делает ровно один запрос', async () => {
        mockFetch.mockResolvedValueOnce(makeOkResponse(detailFixture));
        await fetchPokemonDetail('pikachu');
        expect(mockFetch).toHaveBeenCalledTimes(1);
    });
});

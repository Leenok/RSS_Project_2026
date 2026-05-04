import type { PokemonListResponse, PokemonDetail } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit: number = 200): Promise<PokemonListResponse> => {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    if (!response.ok) {
        throw new Error('Ошибка загрузки списка покемонов');
    }
    return response.json();
};

export const fetchPokemonDetail = async (name: string): Promise<PokemonDetail> => {
    const response = await fetch(`${BASE_URL}/pokemon/${name}`);
    if (!response.ok) {
        throw new Error(`Покемон "${name}" не найден`);
    }
    return response.json();
};

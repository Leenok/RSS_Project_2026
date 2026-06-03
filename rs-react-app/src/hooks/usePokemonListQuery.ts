import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPokemonList, fetchPokemonDetail } from '../services/pokemonApi';
import type { PokemonDetail } from '../types/pokemon';
import { queryKeys } from '../lib/queryKeys';

const POKEMON_LIMIT = 50;

async function fetchAllPokemonDetails(): Promise<PokemonDetail[]> {
    const listData = await fetchPokemonList(POKEMON_LIMIT);
    const results = listData.results;
    const batchSize = 10;
    const detailed: PokemonDetail[] = [];

    for (let i = 0; i < results.length; i += batchSize) {
        const batch = results.slice(i, i + batchSize);
        const batchDetails = await Promise.all(
            batch.map((p) => fetchPokemonDetail(p.name))
        );
        detailed.push(...batchDetails);
    }
    return detailed;
}

export function usePokemonListQuery() {
    const queryClient = useQueryClient();

    const query = useQuery<PokemonDetail[], Error>({
        queryKey: queryKeys.pokemonList(POKEMON_LIMIT),
        queryFn: fetchAllPokemonDetails,
    });

    const refresh = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.pokemonList(POKEMON_LIMIT) });
    };

    return { ...query, refresh };
}
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPokemonDetail } from '../services/pokemonApi';
import type { PokemonDetail } from '../types/pokemon';
import { queryKeys } from '../lib/queryKeys';

export function usePokemonDetailQuery(nameOrId: string | undefined) {
    const queryClient = useQueryClient();

    const query = useQuery<PokemonDetail, Error>({
        queryKey: queryKeys.pokemonDetail(nameOrId ?? ''),
        queryFn: () => fetchPokemonDetail(nameOrId!),
        enabled: Boolean(nameOrId),
    });

    const refresh = () => {
        if (nameOrId) {
            queryClient.invalidateQueries({ queryKey: queryKeys.pokemonDetail(nameOrId) });
        }
    };

    return { ...query, refresh };
}
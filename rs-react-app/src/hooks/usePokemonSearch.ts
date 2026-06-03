import { useState, useCallback, useMemo } from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { useLocalStorage } from './useLocalStorage';
import { usePokemonListQuery } from './usePokemonListQuery';

const ITEMS_PER_PAGE = 10;
const STORAGE_KEY = 'pokemon_search_query';

interface UsePokemonSearchResult {
    allPokemons: PokemonDetail[];
    paginatedPokemons: PokemonDetail[];
    loading: boolean;
    error: string | null;
    searchQuery: string;
    currentPage: number;
    totalPages: number;
    handleSearch: (query: string) => void;
    setPage: (page: number) => void;
    refresh: () => void;
}

export function usePokemonSearch(
    urlPage: number,
    onPageChange: (page: number) => void
): UsePokemonSearchResult {
    const [savedQuery, setSavedQuery] = useLocalStorage<string>(STORAGE_KEY, '');
    const [searchQuery, setSearchQuery] = useState<string>(savedQuery);

    const { data: allPokemons = [], isLoading, error: queryError, refresh } = usePokemonListQuery();

    const filteredPokemons = useMemo(() => {
        if (!searchQuery.trim()) return allPokemons;
        const lower = searchQuery.toLowerCase();
        return allPokemons.filter((p) => p.name.toLowerCase().includes(lower));
    }, [allPokemons, searchQuery]);

    const handleSearch = useCallback(
        (query: string) => {
            setSearchQuery(query);
            setSavedQuery(query);
            onPageChange(1);
        },
        [setSavedQuery, onPageChange]
    );

    const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE));
    const safePage = Math.min(Math.max(1, urlPage), totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    const paginatedPokemons = filteredPokemons.slice(start, start + ITEMS_PER_PAGE);

    const setPage = useCallback(
        (page: number) => {
            onPageChange(page);
        },
        [onPageChange]
    );

    const errorMessage = queryError ? queryError.message || 'Error loading Pokémon' : null;

    return {
        allPokemons,
        paginatedPokemons,
        loading: isLoading,
        error: errorMessage,
        searchQuery,
        currentPage: safePage,
        totalPages,
        handleSearch,
        setPage,
        refresh,
    };
}
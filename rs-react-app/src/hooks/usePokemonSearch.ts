import { useState, useEffect, useCallback } from 'react';
import type { PokemonDetail } from '../types/pokemon';
import { fetchPokemonList, fetchPokemonDetail } from '../services/pokemonApi';
import { useLocalStorage } from './useLocalStorage';

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
}

export function usePokemonSearch(urlPage: number, onPageChange: (page: number) => void): UsePokemonSearchResult {
    const [savedQuery, setSavedQuery] = useLocalStorage<string>(STORAGE_KEY, '');
    const [allPokemons, setAllPokemons] = useState<PokemonDetail[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<PokemonDetail[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>(savedQuery);

    const filterPokemons = useCallback((pokemons: PokemonDetail[], query: string) => {
        if (!query.trim()) return pokemons;
        const lower = query.toLowerCase();
        return pokemons.filter(p => p.name.toLowerCase().includes(lower));
    }, []);

    useEffect(() => {
        const loadAll = async () => {
            setLoading(true);
            setError(null);
            try {
                const listData = await fetchPokemonList(50);
                const results = listData.results;
                const batchSize = 10;
                const detailed: PokemonDetail[] = [];
                for (let i = 0; i < results.length; i += batchSize) {
                    const batch = results.slice(i, i + batchSize);
                    const batchDetails = await Promise.all(batch.map(p => fetchPokemonDetail(p.name)));
                    detailed.push(...batchDetails);
                }
                setAllPokemons(detailed);
                setFilteredPokemons(filterPokemons(detailed, savedQuery));
            } catch {
                setError('Error loading Pokemon');
            } finally {
                setLoading(false);
            }
        };
        loadAll();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
        setSavedQuery(query);
        setFilteredPokemons(filterPokemons(allPokemons, query));
        onPageChange(1);
    }, [allPokemons, filterPokemons, setSavedQuery, onPageChange]);

    const totalPages = Math.max(1, Math.ceil(filteredPokemons.length / ITEMS_PER_PAGE));
    const safePage = Math.min(Math.max(1, urlPage), totalPages);
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    const paginatedPokemons = filteredPokemons.slice(start, start + ITEMS_PER_PAGE);

    const setPage = useCallback((page: number) => {
        onPageChange(page);
    }, [onPageChange]);

    return {
        allPokemons,
        paginatedPokemons,
        loading,
        error,
        searchQuery,
        currentPage: safePage,
        totalPages,
        handleSearch,
        setPage,
    };
}

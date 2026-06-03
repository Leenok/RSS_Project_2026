import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { usePokemonListQuery } from '../usePokemonListQuery';
import * as pokemonApi from '../../services/pokemonApi';
import type { PokemonDetail } from '../../types/pokemon';

const mockPokemons: PokemonDetail[] = [
  { id: 1, name: 'bulbasaur', sprites: { front_default: 'url1' }, types: [{ type: { name: 'grass' } }] },
  { id: 2, name: 'ivysaur', sprites: { front_default: 'url2' }, types: [{ type: { name: 'grass' } }] },
];

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

describe('usePokemonListQuery', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows loading state initially', () => {
    vi.spyOn(pokemonApi, 'fetchPokemonList').mockReturnValue(new Promise(() => {}));
    vi.spyOn(pokemonApi, 'fetchPokemonDetail').mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonListQuery(), { wrapper: makeWrapper() });
    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it('returns pokemon data on success', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonList').mockResolvedValue({
      count: 2,
      next: null,
      previous: null,
      results: [{ name: 'bulbasaur', url: '' }, { name: 'ivysaur', url: '' }],
    });
    vi.spyOn(pokemonApi, 'fetchPokemonDetail')
      .mockResolvedValueOnce(mockPokemons[0])
      .mockResolvedValueOnce(mockPokemons[1]);

    const { result } = renderHook(() => usePokemonListQuery(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
    expect(result.current.data![0].name).toBe('bulbasaur');
  });

  it('returns error on fetch failure', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonList').mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => usePokemonListQuery(), { wrapper: makeWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });

  it('exposes a refresh function', () => {
    vi.spyOn(pokemonApi, 'fetchPokemonList').mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonListQuery(), { wrapper: makeWrapper() });
    expect(typeof result.current.refresh).toBe('function');
  });
});

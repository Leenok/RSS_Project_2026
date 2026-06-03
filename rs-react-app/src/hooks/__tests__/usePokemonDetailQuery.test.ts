import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { usePokemonDetailQuery } from '../usePokemonDetailQuery';
import * as pokemonApi from '../../services/pokemonApi';
import type { PokemonDetail } from '../../types/pokemon';

const mockPokemon: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'url1' },
  types: [{ type: { name: 'grass' } }],
};

function makeWrapper() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: qc }, children);
}

describe('usePokemonDetailQuery', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('does not fetch when nameOrId is undefined', () => {
    const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemonDetail');
    const { result } = renderHook(() => usePokemonDetailQuery(undefined), {
      wrapper: makeWrapper(),
    });

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.isLoading).toBe(false);
  });

  it('shows loading state when fetching', () => {
    vi.spyOn(pokemonApi, 'fetchPokemonDetail').mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonDetailQuery('bulbasaur'), {
      wrapper: makeWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('returns pokemon data on success', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonDetail').mockResolvedValue(mockPokemon);

    const { result } = renderHook(() => usePokemonDetailQuery('bulbasaur'), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.name).toBe('bulbasaur');
    expect(result.current.data?.id).toBe(1);
  });

  it('returns error on fetch failure', async () => {
    vi.spyOn(pokemonApi, 'fetchPokemonDetail').mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => usePokemonDetailQuery('unknown'), {
      wrapper: makeWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Not found');
  });

  it('exposes a refresh function', () => {
    vi.spyOn(pokemonApi, 'fetchPokemonDetail').mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => usePokemonDetailQuery('bulbasaur'), {
      wrapper: makeWrapper(),
    });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('caches data — concurrent subscribers share one fetch', async () => {
    const fetchSpy = vi.spyOn(pokemonApi, 'fetchPokemonDetail').mockResolvedValue(mockPokemon);

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: qc }, children);

    // Mount two hooks simultaneously — they should share a single in-flight request
    const { result: r1 } = renderHook(() => usePokemonDetailQuery('bulbasaur'), { wrapper });
    const { result: r2 } = renderHook(() => usePokemonDetailQuery('bulbasaur'), { wrapper });

    await waitFor(() => expect(r1.current.isSuccess).toBe(true));
    await waitFor(() => expect(r2.current.isSuccess).toBe(true));

    // TanStack Query deduplicates concurrent requests for the same key
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(r1.current.data?.name).toBe('bulbasaur');
    expect(r2.current.data?.name).toBe('bulbasaur');
  });
});

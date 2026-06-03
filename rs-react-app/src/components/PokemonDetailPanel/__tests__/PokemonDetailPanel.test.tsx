import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import PokemonDetailPanel from '../PokemonDetailPanel';
import * as pokemonApi from '../../../services/pokemonApi';

vi.mock('../../../services/pokemonApi');

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ type: { name: 'grass' } }],
};

const renderPanel = (detailId = '1') => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    createElement(
      QueryClientProvider,
      { client: qc },
      <MemoryRouter initialEntries={[`/details/${detailId}`]}>
        <Routes>
          <Route path="/details/:detailId" element={<PokemonDetailPanel />} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    )
  );
};

beforeEach(() => {
  vi.mocked(pokemonApi.fetchPokemonDetail).mockResolvedValue(bulbasaur);
});
afterEach(() => vi.clearAllMocks());

describe('PokemonDetailPanel', () => {
  test('shows spinner while loading', () => {
    vi.mocked(pokemonApi.fetchPokemonDetail).mockReturnValue(new Promise(() => { }));
    renderPanel();
    expect(screen.getByText(/loading details/i)).toBeInTheDocument();
  });

  test('displays pokemon data after loading', async () => {
    renderPanel();
    await waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());
    expect(screen.getByAltText('bulbasaur')).toBeInTheDocument();
  });

  test('close button is present', async () => {
    renderPanel();
    await waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());
    expect(screen.getByLabelText('Close details')).toBeInTheDocument();
  });

  test('shows error on failed load', async () => {
    vi.mocked(pokemonApi.fetchPokemonDetail).mockRejectedValueOnce(new Error('fail'));
    renderPanel();
    await waitFor(() =>
      expect(screen.getByText(/fail/i)).toBeInTheDocument()
    );
  });

  test('close button navigates away', async () => {
    renderPanel();
    await waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());
    await userEvent.click(screen.getByLabelText('Close details'));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  test('refresh button is present', async () => {
    renderPanel();
    expect(screen.getByTestId('detail-refresh-button')).toBeInTheDocument();
  });
});

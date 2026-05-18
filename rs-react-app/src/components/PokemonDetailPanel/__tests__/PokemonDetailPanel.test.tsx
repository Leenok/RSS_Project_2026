import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import PokemonDetailPanel from '../PokemonDetailPanel';
import * as pokemonApi from '../../../services/pokemonApi';

vi.mock('../../../services/pokemonApi');

const bulbasaur = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ type: { name: 'grass' } }],
};

const renderPanel = (detailId = '1') =>
  render(
    <MemoryRouter initialEntries={[`/details/${detailId}`]}>
      <Routes>
        <Route path="/details/:detailId" element={<PokemonDetailPanel />} />
        <Route path="/" element={<div>Home</div>} />
      </Routes>
    </MemoryRouter>
  );

beforeEach(() => {
  vi.mocked(pokemonApi.fetchPokemonDetail).mockResolvedValue(bulbasaur);
});
afterEach(() => vi.clearAllMocks());

describe('PokemonDetailPanel', () => {
  test('показывает спиннер во время загрузки', () => {
    renderPanel();
    expect(screen.getByText(/loading details/i)).toBeInTheDocument();
  });

  test('отображает данные покемона после загрузки', async () => {
    renderPanel();
    await waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());
    expect(screen.getByAltText('bulbasaur')).toBeInTheDocument();
  });

  test('кнопка закрытия присутствует', async () => {
    renderPanel();
    await waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());
    expect(screen.getByLabelText('Close details')).toBeInTheDocument();
  });

  test('показывает ошибку при неудачной загрузке', async () => {
    vi.mocked(pokemonApi.fetchPokemonDetail).mockRejectedValueOnce(new Error('fail'));
    renderPanel();
    await waitFor(() =>
      expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
    );
  });

  test('клик на кнопку Close navigates away', async () => {
    renderPanel();
    await waitFor(() => expect(screen.getByText('#1 bulbasaur')).toBeInTheDocument());
    await userEvent.click(screen.getByLabelText('Close details'));
    expect(screen.getByText('Home')).toBeInTheDocument();
  });
});

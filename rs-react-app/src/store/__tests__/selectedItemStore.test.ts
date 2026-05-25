import { describe, test, expect, beforeEach } from 'vitest';
import { useSelectedItemsStore } from '../selectedItemStore';
import type { PokemonDetail } from '../../types/pokemon';

const pikachu: PokemonDetail = {
  id: 25,
  name: 'pikachu',
  sprites: { front_default: 'https://example.com/pikachu.png' },
  types: [{ type: { name: 'electric' } }],
};

const bulbasaur: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  sprites: { front_default: 'https://example.com/bulbasaur.png' },
  types: [{ type: { name: 'grass' } }],
};

beforeEach(() => {
  useSelectedItemsStore.setState({ selectedItems: [] });
});

describe('selectedItemsStore', () => {
  test('starts with empty selectedItems', () => {
    const { selectedItems } = useSelectedItemsStore.getState();
    expect(selectedItems).toHaveLength(0);
  });

  test('selectItem adds a pokemon', () => {
    useSelectedItemsStore.getState().selectItem(pikachu);
    expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(1);
    expect(useSelectedItemsStore.getState().selectedItems[0].id).toBe(25);
  });

  test('selectItem does not add duplicates', () => {
    useSelectedItemsStore.getState().selectItem(pikachu);
    useSelectedItemsStore.getState().selectItem(pikachu);
    expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(1);
  });

  test('unselectItem removes a pokemon by id', () => {
    useSelectedItemsStore.getState().selectItem(pikachu);
    useSelectedItemsStore.getState().selectItem(bulbasaur);
    useSelectedItemsStore.getState().unselectItem(25);
    const { selectedItems } = useSelectedItemsStore.getState();
    expect(selectedItems).toHaveLength(1);
    expect(selectedItems[0].id).toBe(1);
  });

  test('unselectAll clears all selections', () => {
    useSelectedItemsStore.getState().selectItem(pikachu);
    useSelectedItemsStore.getState().selectItem(bulbasaur);
    useSelectedItemsStore.getState().unselectAll();
    expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(0);
  });

  test('isSelected returns true for selected pokemon', () => {
    useSelectedItemsStore.getState().selectItem(pikachu);
    expect(useSelectedItemsStore.getState().isSelected(25)).toBe(true);
  });

  test('isSelected returns false for non-selected pokemon', () => {
    expect(useSelectedItemsStore.getState().isSelected(999)).toBe(false);
  });
});
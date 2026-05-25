import { render, screen, fireEvent } from '@testing-library/react';
import { describe, test, expect, beforeEach, vi } from 'vitest';
import Flyout from '../Flyout';
import { useSelectedItemsStore } from '../../../store/selectedItemStore';
import type { PokemonDetail } from '../../../types/pokemon';

const pikachu: PokemonDetail = {
    id: 25,
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    types: [{ type: { name: 'electric' } }],
};

const charmander: PokemonDetail = {
    id: 4,
    name: 'charmander',
    sprites: { front_default: 'https://example.com/charmander.png' },
    types: [{ type: { name: 'fire' } }],
};

beforeEach(() => {
    useSelectedItemsStore.setState({ selectedItems: [] });
});

describe('Flyout', () => {
    test('does not render when no items selected', () => {
        render(<Flyout />);
        expect(screen.queryByTestId('flyout')).not.toBeInTheDocument();
    });

    test('renders when at least one item is selected', () => {
        useSelectedItemsStore.getState().selectItem(pikachu);
        render(<Flyout />);
        expect(screen.getByTestId('flyout')).toBeInTheDocument();
    });

    test('displays correct item count for 1 item', () => {
        useSelectedItemsStore.getState().selectItem(pikachu);
        render(<Flyout />);
        expect(screen.getByText(/1 item selected/i)).toBeInTheDocument();
    });

    test('displays correct item count for multiple items', () => {
        useSelectedItemsStore.getState().selectItem(pikachu);
        useSelectedItemsStore.getState().selectItem(charmander);
        render(<Flyout />);
        expect(screen.getByText(/2 items selected/i)).toBeInTheDocument();
    });

    test('renders Unselect all button', () => {
        useSelectedItemsStore.getState().selectItem(pikachu);
        render(<Flyout />);
        expect(screen.getByRole('button', { name: /unselect all/i })).toBeInTheDocument();
    });

    test('renders Download button', () => {
        useSelectedItemsStore.getState().selectItem(pikachu);
        render(<Flyout />);
        expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    test('clicking Unselect all clears selection', () => {
        useSelectedItemsStore.getState().selectItem(pikachu);
        useSelectedItemsStore.getState().selectItem(charmander);
        render(<Flyout />);
        fireEvent.click(screen.getByRole('button', { name: /unselect all/i }));
        expect(useSelectedItemsStore.getState().selectedItems).toHaveLength(0);
    });

    test('clicking Download calls downloadSelectedItemsAsCSV', async () => {
        const mockClick = vi.fn();
        const mockCreateObjectURL = vi.fn(() => 'blob:mock');
        const mockRevokeObjectURL = vi.fn();

        global.URL.createObjectURL = mockCreateObjectURL;
        global.URL.revokeObjectURL = mockRevokeObjectURL;

        const origCreate = document.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation((tag) => {
            const el = origCreate(tag);
            if (tag === 'a') {
                el.click = mockClick;
            }
            return el;
        });

        useSelectedItemsStore.getState().selectItem(pikachu);
        render(<Flyout />);
        fireEvent.click(screen.getByRole('button', { name: /download/i }));

        expect(mockCreateObjectURL).toHaveBeenCalled();
        expect(mockClick).toHaveBeenCalled();

        vi.restoreAllMocks();
    });
});

import { create } from 'zustand';
import { type PokemonDetail } from '../types/pokemon';

interface SelectedItemsState {
    selectedItems: PokemonDetail[];
    selectItem: (pokemon: PokemonDetail) => void;
    unselectItem: (id: number) => void;
    unselectAll: () => void;
    isSelected: (id: number) => boolean;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set, get) => ({
    selectedItems: [],

    selectItem: (pokemon: PokemonDetail) => {
        set((state) => {
            if (state.selectedItems.some((p) => p.id === pokemon.id)) return state;
            return { selectedItems: [...state.selectedItems, pokemon] };
        });
    },

    unselectItem: (id: number) => {
        set((state) => ({
            selectedItems: state.selectedItems.filter((p) => p.id !== id),
        }));
    },

    unselectAll: () => set({ selectedItems: [] }),

    isSelected: (id: number) => get().selectedItems.some((p) => p.id === id),
}));
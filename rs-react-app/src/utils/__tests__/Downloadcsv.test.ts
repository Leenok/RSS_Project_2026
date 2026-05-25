import { describe, test, expect, vi, beforeEach } from 'vitest';
import { downloadSelectedItemsAsCSV } from '../downloadCSV';
import type { PokemonDetail } from '../../types/pokemon';

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

describe('downloadSelectedItemsAsCSV', () => {
    let mockClick: ReturnType<typeof vi.fn>;
    let createdLink: HTMLAnchorElement | null;

    beforeEach(() => {
        mockClick = vi.fn();
        createdLink = null;
        global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
        global.URL.revokeObjectURL = vi.fn();

        const realCreateElement = Document.prototype.createElement.bind(document);
        vi.spyOn(document, 'createElement').mockImplementation((tag) => {
            const el = realCreateElement(tag);
            if (tag === 'a') {
                el.click = mockClick;
                createdLink = el as HTMLAnchorElement;
            }
            return el;
        });
    });

    test('calls URL.createObjectURL with a Blob', () => {
        downloadSelectedItemsAsCSV([pikachu]);
        expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    });

    test('calls link.click()', () => {
        downloadSelectedItemsAsCSV([pikachu]);
        expect(mockClick).toHaveBeenCalled();
    });

    test('sets download filename with item count', () => {
        downloadSelectedItemsAsCSV([pikachu, charmander]);
        expect(createdLink?.download).toBe('2_items.csv');
    });

    test('sets download filename with single item count', () => {
        downloadSelectedItemsAsCSV([pikachu]);
        expect(createdLink?.download).toBe('1_items.csv');
    });

    test('calls URL.revokeObjectURL after download', () => {
        downloadSelectedItemsAsCSV([pikachu]);
        expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
});
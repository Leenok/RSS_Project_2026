import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import PokemonCard from '../PokemonCard';
import type { PokemonDetail } from '../../../types/pokemon';

const basePokemon: PokemonDetail = {
    id: 25,
    name: 'pikachu',
    sprites: { front_default: 'https://example.com/pikachu.png' },
    types: [{ type: { name: 'electric' } }],
};

describe('PokemonCard — rendering', () => {
    test('отображает имя покемона', () => {
        render(<PokemonCard pokemon={basePokemon} />);
        expect(screen.getByText(/#25 pikachu/i)).toBeInTheDocument();
    });

    test('отображает номер покемона', () => {
        render(<PokemonCard pokemon={basePokemon} />);
        expect(screen.getByText(/#25/)).toBeInTheDocument();
    });

    test('отображает метку "Тип:"', () => {
        render(<PokemonCard pokemon={basePokemon} />);
        expect(screen.getByText(/Тип:/)).toBeInTheDocument();
    });

    test('отображает тип покемона', () => {
        render(<PokemonCard pokemon={basePokemon} />);
        expect(screen.getByText(/electric/i)).toBeInTheDocument();
    });

    test('рендерит img с корректным src', () => {
        render(<PokemonCard pokemon={basePokemon} />);
        expect(screen.getByRole('img')).toHaveAttribute(
            'src',
            'https://example.com/pikachu.png'
        );
    });

    test('рендерит img с alt равным имени покемона', () => {
        render(<PokemonCard pokemon={basePokemon} />);
        expect(screen.getByRole('img')).toHaveAttribute('alt', 'pikachu');
    });
});

describe('PokemonCard — multiple types', () => {
    test('отображает несколько типов через запятую', () => {
        const dual: PokemonDetail = {
            ...basePokemon,
            types: [{ type: { name: 'water' } }, { type: { name: 'flying' } }],
        };
        render(<PokemonCard pokemon={dual} />);
        expect(screen.getByText(/water, flying/i)).toBeInTheDocument();
    });

    test('отображает три типа через запятую', () => {
        const triple: PokemonDetail = {
            ...basePokemon,
            types: [
                { type: { name: 'fire' } },
                { type: { name: 'flying' } },
                { type: { name: 'dragon' } },
            ],
        };
        render(<PokemonCard pokemon={triple} />);
        expect(screen.getByText(/fire, flying, dragon/i)).toBeInTheDocument();
    });
});

describe('PokemonCard — edge cases', () => {
    test('использует placeholder если sprites.front_default пустая строка', () => {
        const noSprite: PokemonDetail = {
            ...basePokemon,
            sprites: { front_default: '' },
        };
        render(<PokemonCard pokemon={noSprite} />);
        expect(screen.getByRole('img')).toHaveAttribute(
            'src',
            'https://via.placeholder.com/150'
        );
    });

    test('корректно рендерит покемона с id=1', () => {
        const first: PokemonDetail = { ...basePokemon, id: 1, name: 'bulbasaur' };
        render(<PokemonCard pokemon={first} />);
        expect(screen.getByText(/#1 bulbasaur/)).toBeInTheDocument();
    });
});

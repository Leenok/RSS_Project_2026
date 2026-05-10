import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import PokemonList from '../PokemonList';
import type { PokemonDetail } from '../../../types/pokemon';

const makePokemons = (count: number): PokemonDetail[] =>
    Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        name: `pokemon-${i + 1}`,
        sprites: { front_default: `https://example.com/${i + 1}.png` },
        types: [{ type: { name: 'normal' } }],
    }));

describe('PokemonList — loading state', () => {
    test('показывает текст "Загрузка покемонов" при loading=true', () => {
        render(<PokemonList pokemons={[]} loading={true} error={null} />);
        expect(screen.getByText(/Загрузка покемонов/i)).toBeInTheDocument();
    });

    test('показывает Spinner при loading=true', () => {
        const { container } = render(
            <PokemonList pokemons={[]} loading={true} error={null} />
        );

        const spinner = container.querySelector('[style*="width"]');
        expect(spinner).toBeInTheDocument();
    });

    test('не отображает список покемонов при loading=true', () => {
        render(
            <PokemonList pokemons={makePokemons(2)} loading={true} error={null} />
        );
        expect(screen.queryByText(/pokemon-1/)).not.toBeInTheDocument();
    });
});

describe('PokemonList — error state', () => {
    test('показывает текст ошибки при наличии error', () => {
        render(
            <PokemonList pokemons={[]} loading={false} error="Error loading Pokemon" />
        );
        expect(screen.getByText('Error loading Pokemon')).toBeInTheDocument();
    });

    test('показывает произвольный текст ошибки', () => {
        render(
            <PokemonList pokemons={[]} loading={false} error="Network timeout" />
        );
        expect(screen.getByText('Network timeout')).toBeInTheDocument();
    });

    test('не отображает список при ошибке', () => {
        render(
            <PokemonList
                pokemons={makePokemons(2)}
                loading={false}
                error="some error"
            />
        );
        expect(screen.queryByText(/pokemon-1/)).not.toBeInTheDocument();
    });

    test('loading=true приоритетнее error', () => {
        render(
            <PokemonList pokemons={[]} loading={true} error="some error" />
        );
        expect(screen.getByText(/Загрузка покемонов/i)).toBeInTheDocument();
        expect(screen.queryByText('some error')).not.toBeInTheDocument();
    });
});

describe('PokemonList — empty state', () => {
    test('показывает сообщение "Покемоны не найдены" для пустого массива', () => {
        render(<PokemonList pokemons={[]} loading={false} error={null} />);
        expect(screen.getByText(/Покемоны не найдены/i)).toBeInTheDocument();
    });

    test('не показывает "не найдены" когда есть покемоны', () => {
        render(
            <PokemonList pokemons={makePokemons(1)} loading={false} error={null} />
        );
        expect(screen.queryByText(/Покемоны не найдены/i)).not.toBeInTheDocument();
    });
});

describe('PokemonList — data rendering', () => {
    test('создает карточку для каждого покемона', () => {
        render(<PokemonList pokemons={makePokemons(3)} loading={false} error={null} />);
        expect(screen.getByText(/#1 pokemon-1/)).toBeInTheDocument();
        expect(screen.getByText(/#2 pokemon-2/)).toBeInTheDocument();
        expect(screen.getByText(/#3 pokemon-3/)).toBeInTheDocument();
    });

    test('создает правильное количество изображений', () => {
        render(<PokemonList pokemons={makePokemons(4)} loading={false} error={null} />);
        expect(screen.getAllByRole('img')).toHaveLength(4);
    });

    test('создает одного покемона корректно', () => {
        render(<PokemonList pokemons={makePokemons(1)} loading={false} error={null} />);
        expect(screen.getAllByRole('img')).toHaveLength(1);
    });
});

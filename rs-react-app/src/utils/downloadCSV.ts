import { type PokemonDetail } from '../types/pokemon';

export function downloadSelectedItemsAsCSV(items: PokemonDetail[]): void {
    const headers = ['id', 'name', 'types', 'details_url', 'sprite_url'];

    const rows = items.map((pokemon) => {
        const types = pokemon.types.map((t) => t.type.name).join(' | ');
        const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`;
        return [
            String(pokemon.id),
            pokemon.name,
            types,
            detailsUrl,
            pokemon.sprites.front_default,
        ];
    });

    const csvContent = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
        .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${items.length}_items.csv`;
    link.click();

    URL.revokeObjectURL(url);
}
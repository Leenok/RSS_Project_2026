export const queryKeys = {
    pokemonList: (limit: number) => ['pokemonList', limit] as const,
    pokemonDetail: (nameOrId: string | number) => ['pokemonDetail', String(nameOrId)] as const,
} as const;
import React from 'react';
import { type Pokemon, type PokemonDetail } from '../../types/pokemon';
import PokemonCard from '../PokemonCard/PokemonCard';

interface PokemonListProps {
    pokemons: Pokemon[];
    selectedPokemon: PokemonDetail | null;
}

class PokemonList extends React.Component<PokemonListProps> {
    render() {
        const { pokemons, selectedPokemon } = this.props;
        console.log(this.props)

        if (pokemons.length === 0) {
            return <p >Покемоны не найдены</p>;
        }

        return (
            <div >
                {pokemons.map((pokemon) => (
                    <PokemonCard
                        key={pokemon.name}
                        pokemon={
                            selectedPokemon && selectedPokemon.name === pokemon.name
                                ? selectedPokemon
                                : {
                                    id: 0,
                                    name: pokemon.name,
                                    sprites: { front_default: '' },
                                    types: []
                                }
                        }
                    />
                ))}
            </div>
        );
    }
}

export default PokemonList;

import React from 'react';
import { type PokemonDetail } from '../../types/pokemon';
// import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: PokemonDetail;
}

class PokemonCard extends React.Component<PokemonCardProps> {
    render() {
        const { pokemon } = this.props;
        const types = pokemon.types.map(t => t.type.name).join(', ');

        return (
            <div>
                {/* <div className={styles.card}> */}
                <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                // className={styles.image}
                />
                <h3 >#{pokemon.id} {pokemon.name}</h3>
                {/* className={styles.name} */}
                <p >Тип: {types}</p>
                {/* className={styles.types} */}
            </div>
        );
    }
}

export default PokemonCard;

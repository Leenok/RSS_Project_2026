import React from 'react';
import { type PokemonDetail } from '../../types/pokemon';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: PokemonDetail;
}

class PokemonCard extends React.Component<PokemonCardProps> {
    render() {
        const { pokemon } = this.props;
        const types = pokemon.types.map(t => t.type.name).join(', ');

        return (
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <img
                        src={pokemon.sprites.front_default || 'https://via.placeholder.com/150'}
                        alt={pokemon.name}
                        className={styles.image}
                    />
                </div>
                <h3 className={styles.name}>#{pokemon.id} {pokemon.name}</h3>
                <p className={styles.types}>Тип: {types}</p>
            </div>
        );
    }
}

export default PokemonCard;

import React from 'react';
import PokemonCard from '../PokemonCard/PokemonCard';
import { type PokemonDetail } from '../../types/pokemon';
import styles from './PokemonList.module.css';

interface PokemonListProps {
    pokemons: PokemonDetail[];
    loading: boolean;
    error: string | null;
}

class PokemonList extends React.Component<PokemonListProps> {
    render() {
        const { pokemons, loading, error } = this.props;

        if (loading) {
            return <div className={styles.loading}>Загрузка покемонов...</div>;
        }

        if (error) {
            return <div className={styles.error}>{error}</div>;
        }

        if (pokemons.length === 0) {
            return <div className={styles.empty}>Покемоны не найдены</div>;
        }

        return (
            <div className={styles.list}>
                {pokemons.map((pokemon) => (
                    <PokemonCard key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>
        );
    }
}

export default PokemonList;

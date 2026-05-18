import PokemonCard from '../PokemonCard/PokemonCard';
import { type PokemonDetail } from '../../types/pokemon';
import Spinner from '../Spinner/Spinner';
import styles from './PokemonList.module.css';

interface PokemonListProps {
    pokemons: PokemonDetail[];
    loading: boolean;
    error: string | null;
    onSelectPokemon?: (id: number) => void;
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemons, loading, error, onSelectPokemon }) => {
    if (loading) {
        return (
            <div className={styles.loading}>
                <Spinner size={60} color="#4CAF50" />
                Загрузка покемонов...
            </div>
        );
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
                <PokemonCard
                    key={pokemon.id}
                    pokemon={pokemon}
                    onClick={onSelectPokemon ? () => onSelectPokemon(pokemon.id) : undefined}
                />
            ))}
        </div>
    );
};

export default PokemonList;

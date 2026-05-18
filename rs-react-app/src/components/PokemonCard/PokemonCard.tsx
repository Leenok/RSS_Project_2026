import { type PokemonDetail } from '../../types/pokemon';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: PokemonDetail;
    onClick?: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
    const types = pokemon.types.map(t => t.type.name).join(', ');

    return (
        <div
            className={`${styles.card} ${onClick ? styles.clickable : ''}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
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
};

export default PokemonCard;

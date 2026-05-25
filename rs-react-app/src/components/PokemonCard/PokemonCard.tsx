import { type PokemonDetail } from '../../types/pokemon';
import { useSelectedItemsStore } from '../../store/selectedItemStore';
import styles from './PokemonCard.module.css';

interface PokemonCardProps {
    pokemon: PokemonDetail;
    onClick?: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onClick }) => {
    const types = pokemon.types.map(t => t.type.name).join(', ');
    const isSelected = useSelectedItemsStore((s) => s.isSelected(pokemon.id));
    const selectItem = useSelectedItemsStore((s) => s.selectItem);
    const unselectItem = useSelectedItemsStore((s) => s.unselectItem);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (e.target.checked) {
            selectItem(pokemon);
        } else {
            unselectItem(pokemon.id);
        }
    };

    const handleCheckboxClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            className={`${styles.card} ${onClick ? styles.clickable : ''} ${isSelected ? styles.selected : ''}`}
            onClick={onClick}
            role={onClick ? 'button' : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        >
            <div className={styles.checkboxWrapper} onClick={handleCheckboxClick}>
                <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSelected}
                    onChange={handleCheckboxChange}
                    aria-label={`Select ${pokemon.name}`}
                />
            </div>
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

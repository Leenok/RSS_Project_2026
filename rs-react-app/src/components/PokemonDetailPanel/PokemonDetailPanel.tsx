import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { usePokemonDetailQuery } from '../../hooks/usePokemonDetailQuery';
import Spinner from '../Spinner/Spinner';
import styles from './PokemonDetailPanel.module.css';

const PokemonDetailPanel: React.FC = () => {
  const { detailId } = useParams<{ detailId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: pokemon, isLoading, error, refresh } = usePokemonDetailQuery(detailId);

  const handleClose = () => {
    const page = searchParams.get('page') ?? '1';
    navigate(`/?page=${page}`);
  };

  return (
    <aside className={styles.panel} data-testid="detail-panel">
      <button className={styles.closeBtn} onClick={handleClose} aria-label="Close details">
        ✕
      </button>

      <button
        type="button"
        className={styles.refreshBtn}
        onClick={refresh}
        disabled={isLoading}
        data-testid="detail-refresh-button"
      >
        {isLoading ? 'Loading…' : '🔄 Refresh'}
      </button>

      {isLoading && (
        <div className={styles.loading}>
          <Spinner size={50} color="#4CAF50" />
          <p>Loading details…</p>
        </div>
      )}

      {error && <p className={styles.error}>{error.message || 'Failed to load Pokémon details'}</p>}

      {pokemon && !isLoading && (
        <div className={styles.content}>
          <img
            src={pokemon.sprites.front_default || 'https://via.placeholder.com/150'}
            alt={pokemon.name}
            className={styles.sprite}
          />
          <h2 className={styles.name}>
            #{pokemon.id} {pokemon.name}
          </h2>
          <div className={styles.types}>
            {pokemon.types.map((t) => (
              <span key={t.type.name} className={`${styles.typeBadge} ${styles[t.type.name] ?? ''}`}>
                {t.type.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};

export default PokemonDetailPanel;
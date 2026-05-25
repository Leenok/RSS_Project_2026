import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchPokemonDetail } from '../../services/pokemonApi';
import type { PokemonDetail } from '../../types/pokemon';
import Spinner from '../Spinner/Spinner';
import styles from './PokemonDetailPanel.module.css';

const PokemonDetailPanel: React.FC = () => {
  const { detailId } = useParams<{ detailId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailId) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      setPokemon(null);
      try {
        const data = await fetchPokemonDetail(detailId);
        if (!cancelled) setPokemon(data);
      } catch {
        if (!cancelled) setError('Failed to load Pokémon details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [detailId]);

  const handleClose = () => {
    const page = searchParams.get('page') ?? '1';
    navigate(`/?page=${page}`);
  };

  return (
    <aside className={styles.panel} data-testid="detail-panel">
      <button className={styles.closeBtn} onClick={handleClose} aria-label="Close details">
        ✕
      </button>

      {loading && (
        <div className={styles.loading}>
          <Spinner size={50} color="#4CAF50" />
          <p>Loading details…</p>
        </div>
      )}

      {error && <p className={styles.error}>{error}</p>}

      {pokemon && !loading && (
        <div className={styles.content}>
          <img
            src={pokemon.sprites.front_default || 'https://via.placeholder.com/150'}
            alt={pokemon.name}
            className={styles.sprite}
          />
          <h2 className={styles.name}>#{pokemon.id} {pokemon.name}</h2>
          <div className={styles.types}>
            {pokemon.types.map(t => (
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

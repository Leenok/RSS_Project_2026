import styles from './Pagination.module.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages: number[] = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    for (let i = left; i <= right; i++) {
        pages.push(i);
    }

    return (
        <nav className={styles.pagination} aria-label="Pagination">
            <button
                className={styles.pageBtn}
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                &laquo;
            </button>

            {left > 1 && (
                <>
                    <button className={styles.pageBtn} onClick={() => onPageChange(1)}>1</button>
                    {left > 2 && <span className={styles.ellipsis}>…</span>}
                </>
            )}

            {pages.map(page => (
                <button
                    key={page}
                    className={`${styles.pageBtn} ${page === currentPage ? styles.active : ''}`}
                    onClick={() => onPageChange(page)}
                    aria-current={page === currentPage ? 'page' : undefined}
                >
                    {page}
                </button>
            ))}

            {right < totalPages && (
                <>
                    {right < totalPages - 1 && <span className={styles.ellipsis}>…</span>}
                    <button className={styles.pageBtn} onClick={() => onPageChange(totalPages)}>{totalPages}</button>
                </>
            )}

            <button
                className={styles.pageBtn}
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                &raquo;
            </button>
        </nav>
    );
};

export default Pagination;

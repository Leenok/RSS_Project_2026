import { useSelectedItemsStore } from '../../store/selecteditemsstore';
import { downloadSelectedItemsAsCSV } from '../../utils/downloadcsv';
import styles from './Flyout.module.css';

const Flyout: React.FC = () => {
    const selectedItems = useSelectedItemsStore((s) => s.selectedItems);
    const unselectAll = useSelectedItemsStore((s) => s.unselectAll);

    if (selectedItems.length === 0) return null;

    const handleDownload = () => {
        downloadSelectedItemsAsCSV(selectedItems);
    };

    return (
        <div className={styles.flyout} data-testid="flyout">
            <span className={styles.count}>
                {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
            </span>
            <div className={styles.actions}>
                <button
                    type="button"
                    className={styles.btnSecondary}
                    onClick={unselectAll}
                >
                    Unselect all
                </button>
                <button
                    type="button"
                    className={styles.btnPrimary}
                    onClick={handleDownload}
                >
                    Download
                </button>
            </div>
        </div>
    );
};

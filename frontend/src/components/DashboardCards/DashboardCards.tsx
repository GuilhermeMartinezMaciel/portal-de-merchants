import type { Merchant } from '../../types/merchant';
import styles from './DashboardCards.module.css';

interface DashboardCardsProps {
    merchants: Merchant[];
}

export function DashboardCards({ merchants }: DashboardCardsProps) {
    // Calculando as métricas dinamicamente
    const total = merchants.length;
    const pending = merchants.filter(m => m.status === 'pending_analysis').length;
    const approved = merchants.filter(m => m.status === 'approved').length;
    const problem = merchants.filter(m => m.status === 'rejected' || m.status === 'blocked').length;

    return (
        <section className={styles.grid}>
            <div className={`${styles.card} ${styles.cardTotal}`}>
                <h3 className={styles.title}>Total de Merchants</h3>
                <p className={styles.value}>{total}</p>
            </div>

            <div className={`${styles.card} ${styles.cardPending}`}>
                <h3 className={styles.title}>Aguardando Análise</h3>
                <p className={styles.value}>{pending}</p>
            </div>

            <div className={`${styles.card} ${styles.cardApproved}`}>
                <h3 className={styles.title}>Aprovados / Ativos</h3>
                <p className={styles.value}>{approved}</p>
            </div>

            <div className={`${styles.card} ${styles.cardAlert}`}>
                <h3 className={styles.title}>Bloqueados / Rejeitados</h3>
                <p className={styles.value}>{problem}</p>
            </div>
        </section>
    );
}
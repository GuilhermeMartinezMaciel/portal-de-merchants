import styles from './Header.module.css';

export function Header() {
    return (
        <header className={styles.container}>
            <h1 className={styles.title}>
                Portal de Merchants
            </h1>
            <p className={styles.subtitle}>
                Análise e gestão de estabelecimentos parceiros
            </p>
        </header>
    );
}
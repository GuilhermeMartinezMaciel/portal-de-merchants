import type { Merchant } from '../../types/merchant';
import styles from './MerchantTable.module.css';


interface MerchantTableProps {
    merchants: Merchant[];
    loading: boolean;
    filtroStatus: string;
    setFiltroStatus: (status: string) => void;
    onAvancarStatus: (id: number, acao: 'send' | 'approve') => void;
    onAcaoComMotivo: (id: number, acao: 'reject' | 'block') => void;
    onEdit: (merchant: Merchant) => void;
    buscaId: string;
    setBuscaId: (id: string) => void;
    onBuscarPorId: (e: React.FormEvent) => void;
    onLimparBusca: () => void;
}



export function MerchantTable({
    merchants,
    loading,
    filtroStatus,
    setFiltroStatus,
    onAvancarStatus,
    onAcaoComMotivo,
    onEdit,
    buscaId,
    setBuscaId,
    onBuscarPorId,
    onLimparBusca
}: MerchantTableProps) {

    // Função auxiliar para renderizar a cor do status
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved': return { bg: '#dcfce7', color: '#166534' };
            case 'draft': return { bg: '#f1f5f9', color: '#475569' };
            case 'rejected':
            case 'blocked': return { bg: '#fee2e2', color: '#991b1b' };
            default: return { bg: '#fef9c3', color: '#854d0e' };
        }
    };

    return (
        <section className={styles.section}>
            <div className={styles.header}>
                <h2 className={styles.title}> Estabelecimentos Cadastrados</h2>
                <div className={styles.filterGroup} style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }}>

                    {/* Barra de Pesquisa por ID */}
                    <form onSubmit={onBuscarPorId} style={{ display: 'flex', gap: '0.5rem', marginRight: '1rem' }}>
                        <input
                            type="number"
                            placeholder="Buscar por ID..."
                            className={styles.select}
                            value={buscaId}
                            onChange={e => setBuscaId(e.target.value)}
                            style={{ width: '140px' }}
                        />
                        <button type="submit" className={`${styles.btn} ${styles.btnSend}`} style={{ margin: 0 }}>
                            Buscar
                        </button>
                        {/* O botão Limpar só aparece se houver algo digitado */}
                        {buscaId && (
                            <button type="button" onClick={onLimparBusca} className={styles.btn} style={{ background: '#475569', margin: 0 }}>
                                Limpar
                            </button>
                        )}
                    </form>

                    {/* Filtro de Status Original */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label className={styles.filterLabel}>Filtrar por Status:</label>
                        <select
                            className={styles.select}
                            value={filtroStatus}
                            onChange={e => {
                                setFiltroStatus(e.target.value);
                                if (buscaId) onLimparBusca(); // Limpa a busca por ID se mudar o status
                            }}
                        >
                            <option value="">Todos</option>
                            <option value="draft">Draft</option>
                            <option value="pending_analysis">Pending Analysis</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                            <option value="blocked">Blocked</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableWrapper}>
                {loading ? <p style={{ padding: '2rem' }}>Carregando registros...</p> : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: '60px' }}>ID</th>
                                <th>Razão Social / CNPJ</th>
                                <th>E-mail</th>
                                <th>Status Atual</th>
                                <th>Ações Disponíveis</th>
                                <th>Histórico (Timeline)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {merchants.map(m => {
                                const badge = getStatusBadge(m.status);
                                return (
                                    <tr key={m.id}>
                                        {/* 1. Coluna do ID */}
                                        <td style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>
                                            #{m.id}
                                        </td>

                                        {/* 2. Coluna da Razão Social */}
                                        <td>
                                            <strong style={{ color: 'var(--text-primary)' }}>{m.razao_social}</strong><br />
                                            <small style={{ color: 'var(--text-secondary)' }}>CNPJ: {m.cnpj}</small>
                                        </td>

                                        {/* 3. Coluna do E-mail */}
                                        <td>{m.email}</td>

                                        {/* 4. Coluna do Status */}
                                        <td>
                                            <span style={{
                                                padding: '0.25rem 0.5rem', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.85rem',
                                                backgroundColor: badge.bg, color: badge.color
                                            }}>
                                                {m.status.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>

                                        {/* 5. Coluna de Ações */}
                                        <td>
                                            {m.status === 'draft' && (
                                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                                    <button onClick={() => onEdit(m)} className={styles.btn} style={{ background: '#3b82f6', color: '#fff' }}>
                                                        Editar
                                                    </button>
                                                    <button onClick={() => onAvancarStatus(m.id, 'send')} className={`${styles.btn} ${styles.btnSend}`}>
                                                        Enviar p/ Análise
                                                    </button>
                                                </div>
                                            )}
                                            {m.status === 'pending_analysis' && (
                                                <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                                                    <button onClick={() => onAvancarStatus(m.id, 'approve')} className={`${styles.btn} ${styles.btnApprove}`}>
                                                        Aprovar
                                                    </button>
                                                    <button onClick={() => onAcaoComMotivo(m.id, 'reject')} className={`${styles.btn} ${styles.btnReject}`}>
                                                        Rejeitar
                                                    </button>
                                                </div>
                                            )}
                                            {m.status === 'approved' && (
                                                <button onClick={() => onAcaoComMotivo(m.id, 'block')} className={`${styles.btn} ${styles.btnBlock}`}>
                                                    Bloquear
                                                </button>
                                            )}
                                        </td>

                                        {/* 6. Coluna da Timeline */}
                                        <td style={{ minWidth: '250px' }}>
                                            <ul className={styles.timelineList}>
                                                {m.timeline?.map((evt, idx) => (
                                                    <li key={idx} className={styles.timelineItem}>
                                                        <strong>{evt.title}</strong> <br />
                                                        <small style={{ color: 'var(--text-secondary)' }}>{new Date(evt.created_at).toLocaleString('pt-BR')}</small>
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* Ajuste do colSpan para 6 quando não houver resultados */}
                            {merchants.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                        Nenhum estabelecimento encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>
        </section>
    );
}
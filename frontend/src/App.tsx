import { useEffect, useState } from 'react';
import { merchantService } from './services/api';
import type { Merchant } from './types/merchant';
import styles from './App.module.css';

import { Header } from './components/Header/Header';
import { MerchantForm } from './components/MerchantForm/MerchantForm';
import { DashboardCards } from './components/DashboardCards/DashboardCards';
import { MerchantTable } from './components/MerchantTable/MerchantTable';

export default function App() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [merchantEmEdicao, setMerchantEmEdicao] = useState<Merchant | null>(null);
  const [buscaId, setBuscaId] = useState<string>(''); // Novo estado para a barra de pesquisa

  const carregarMerchants = async (status_filtro?: string) => {
    try {
      setLoading(true);
      const dados = await merchantService.list(status_filtro);
      setMerchants(dados);
    } catch (error) {
      alert('Erro ao buscar merchants do servidor backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarMerchants(filtroStatus);
  }, [filtroStatus]);

  // Função para buscar um merchant específico pelo ID
  const handleBuscarPorId = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buscaId) {
      carregarMerchants(filtroStatus);
      return;
    }

    try {
      setLoading(true);
      const merchantEncontrado = await merchantService.getById(Number(buscaId));
      // Como a tabela espera uma lista (array), nós colocamos o resultado dentro de colchetes
      setMerchants([merchantEncontrado]);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setMerchants([]); // Limpa a tabela se não encontrar ninguém com esse ID
      } else {
        alert('Erro ao buscar o ID no servidor.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar a busca e voltar a mostrar todos
  const handleLimparBusca = () => {
    setBuscaId('');
    carregarMerchants(filtroStatus);
  };

  const handleAvancarStatus = async (id: number, acao: 'send' | 'approve') => {
    try {
      if (acao === 'send') await merchantService.sendToAnalysis(id);
      if (acao === 'approve') await merchantService.approve(id);
      carregarMerchants(filtroStatus);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro na transição de status.');
    }
  };

  const handleAcaoComMotivo = async (id: number, acao: 'reject' | 'block') => {
    const motivo = prompt(`Digite o motivo da ${acao === 'reject' ? 'rejeição' : 'bloqueio'}:`);
    if (!motivo) return;

    try {
      if (acao === 'reject') await merchantService.reject(id, motivo);
      if (acao === 'block') await merchantService.block(id, motivo);
      carregarMerchants(filtroStatus);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao executar ação.');
    }
  };

  return (
    <div className={styles.dashboardLayout}>

      {/* BARRA LATERAL (Esquerda) */}
      <aside className={styles.sidebar}>
        <Header />

        {/* Título extra para organizar a sidebar */}
        <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '-1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Métricas Gerais
        </h3>

        <DashboardCards merchants={merchants} />
      </aside>

      {/* CONTEÚDO PRINCIPAL (Direita) */}
      <main className={styles.mainContent}>

        <MerchantForm
          onSuccess={() => carregarMerchants(filtroStatus)}
          merchantEmEdicao={merchantEmEdicao}
          onCancelarEdicao={() => setMerchantEmEdicao(null)}
        />

        <MerchantTable
          merchants={merchants}
          loading={loading}
          filtroStatus={filtroStatus}
          setFiltroStatus={setFiltroStatus}
          onAvancarStatus={handleAvancarStatus}
          onAcaoComMotivo={handleAcaoComMotivo}
          onEdit={(merchant) => {
            setMerchantEmEdicao(merchant);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          buscaId={buscaId}
          setBuscaId={setBuscaId}
          onBuscarPorId={handleBuscarPorId}
          onLimparBusca={handleLimparBusca}
        />

      </main>

    </div>
  );
}
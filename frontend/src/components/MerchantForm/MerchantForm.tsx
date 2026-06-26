import { useState, useEffect } from 'react';
import { merchantService } from '../../services/api';
import type { Merchant } from '../../types/merchant';
import styles from './MerchantForm.module.css';

interface MerchantFormProps {
    onSuccess: () => void;
    merchantEmEdicao: Merchant | null;
    onCancelarEdicao: () => void;
}

export function MerchantForm({ onSuccess, merchantEmEdicao, onCancelarEdicao }: MerchantFormProps) {
    const [cnpj, setCnpj] = useState('');
    const [razaoSocial, setRazaoSocial] = useState('');
    const [nomeFantasia, setNomeFantasia] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');

    // Se receber um merchant para edição, preenche os campos automaticamente
    useEffect(() => {
        if (merchantEmEdicao) {
            setCnpj(merchantEmEdicao.cnpj);
            setRazaoSocial(merchantEmEdicao.razao_social);
            setNomeFantasia(merchantEmEdicao.nome_fantasia || '');
            setEmail(merchantEmEdicao.email);
            setTelefone(merchantEmEdicao.telefone || '');
        } else {
            limparFormulario();
        }
    }, [merchantEmEdicao]);

    const limparFormulario = () => {
        setCnpj('');
        setRazaoSocial('');
        setNomeFantasia('');
        setEmail('');
        setTelefone('');
    };

    const handleSalvar = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                cnpj,
                razao_social: razaoSocial,
                nome_fantasia: nomeFantasia || undefined,
                email,
                telefone: telefone || undefined,
            };

            if (merchantEmEdicao) {
                // Modo Edição (PATCH)
                await merchantService.update(merchantEmEdicao.id, payload);
                alert('Merchant atualizado com sucesso!');
                onCancelarEdicao(); // Sai do modo de edição
            } else {
                // Modo Cadastro (POST)
                await merchantService.create(payload);
                alert('Merchant criado com sucesso!');
                limparFormulario();
            }

            onSuccess();
        } catch (error: any) {
            const msgErro = error.response?.data?.cnpj?.[0] || error.response?.data?.error || 'Erro ao salvar.';
            alert(msgErro);
        }
    };

    return (
        <section className={styles.card}>
            <h2 className={styles.title}>
                {merchantEmEdicao ? ' Editar Merchant' : ' Cadastrar Novo Merchant'}
            </h2>

            <form onSubmit={handleSalvar} className={styles.formGrid}>
                <div className={styles.inputGroup}>
                    <label className={styles.label}>CNPJ (apenas números)*</label>
                    <input className={styles.input} type="text" value={cnpj} onChange={e => setCnpj(e.target.value)} required />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Razão Social*</label>
                    <input className={styles.input} type="text" value={razaoSocial} onChange={e => setRazaoSocial(e.target.value)} required />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Nome Fantasia</label>
                    <input className={styles.input} type="text" value={nomeFantasia} onChange={e => setNomeFantasia(e.target.value)} />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>E-mail de Contato*</label>
                    <input className={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div className={styles.inputGroup}>
                    <label className={styles.label}>Telefone</label>
                    <input className={styles.input} type="text" value={telefone} onChange={e => setTelefone(e.target.value)} />
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <button type="submit" className={`${styles.submitBtn} ${styles.hoverunderline}`}>
                        {merchantEmEdicao ? 'Atualizar Estabelecimento' : 'Salvar Estabelecimento'}
                    </button>

                    {merchantEmEdicao && (
                        <button
                            type="button"
                            onClick={onCancelarEdicao}
                            style={{ padding: '0.8rem', background: '#475569', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            Cancelar Edição
                        </button>
                    )}
                </div>
            </form>
        </section >
    );
}
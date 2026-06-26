export type MerchantStatus = 'draft' | 'pending_analysis' | 'approved' | 'rejected' | 'blocked';

export interface MerchantEvent {
    title: string;
    created_at: string;
}

export interface Merchant {
    id: number;
    cnpj: string;
    razao_social: string;
    nome_fantasia?: string;
    email: string;
    telefone?: string;
    created_at: string;
    status: MerchantStatus;
    timeline: MerchantEvent[];
}
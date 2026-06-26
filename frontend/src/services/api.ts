import axios from 'axios';
import type { Merchant } from '../types/merchant';

// Cria uma instância do Axios apontando para a URL padrão do Django
const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
});

export const merchantService = {
    // Lista todos os merchants (podendo passar filtro de status opcional)
    list: async (status?: string) => {
        const response = await api.get<Merchant[]>('/merchants/', {
            params: status ? { status } : {},
        });
        return response.data;
    },

    // Consulta um único merchant por ID
    getById: async (id: number) => {
        const response = await api.get<Merchant>(`/merchants/${id}/`);
        return response.data;
    },

    // Cadastra um novo merchant
    create: async (data: Omit<Merchant, 'id' | 'created_at' | 'status' | 'timeline'>) => {
        const response = await api.post<Merchant>('/merchants/', data);
        return response.data;
    },

    // Atualiza os dados (enquanto estiver em draft)
    update: async (id: number, data: Partial<Merchant>) => {
        const response = await api.patch<Merchant>(`/merchants/${id}/`, data);
        return response.data;
    },

    // Envia para análise
    sendToAnalysis: async (id: number) => {
        const response = await api.post<Merchant>(`/merchants/${id}/send-to-analysis/`);
        return response.data;
    },

    // Aprova o merchant
    approve: async (id: number) => {
        const response = await api.post<Merchant>(`/merchants/${id}/approve/`);
        return response.data;
    },

    // Rejeita informando o motivo
    reject: async (id: number, motivo: string) => {
        const response = await api.post<Merchant>(`/merchants/${id}/reject/`, { motivo });
        return response.data;
    },

    // Bloqueia informando o motivo
    block: async (id: number, motivo: string) => {
        const response = await api.post<Merchant>(`/merchants/${id}/block/`, { motivo });
        return response.data;
    },
};
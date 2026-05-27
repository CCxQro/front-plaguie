import { backendClient } from '../http/backendClient';
import type { ValidateDto } from '../vigilancia/vigilanciaService';

export interface AlertaDto {
  alertaId: number;
  titulo: string;
  descripcion?: string;
  ubicacionId: number;
  tipoPlaga: string;
  hectareas: number;
  severidad: 'critico' | 'advertencia' | 'informacion';
  reportedByUserId: number;
  createdAt: string;
  statusId: number;
  statusName: string;
  validatedByUserId?: number;
  validatedAt?: string;
}

export interface CreateAlertaDto {
  titulo: string;
  descripcion?: string;
  ubicacionId: number;
  tipoPlaga: string;
  hectareas: number;
  severidad: 'critico' | 'advertencia' | 'informacion';
}

export const alertasService = {
  async getAll(): Promise<AlertaDto[]> {
    const { data } = await backendClient.get<AlertaDto[]>('/api/alertas');
    return data;
  },

  async getById(id: number): Promise<AlertaDto> {
    const { data } = await backendClient.get<AlertaDto>(`/api/alertas/${id}`);
    return data;
  },

  async create(payload: CreateAlertaDto): Promise<AlertaDto> {
    const { data } = await backendClient.post<AlertaDto>('/api/alertas', payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await backendClient.delete(`/api/alertas/${id}`);
  },

  async validate(id: number, payload: ValidateDto): Promise<AlertaDto> {
    const { data } = await backendClient.patch<AlertaDto>(`/api/alertas/${id}/validate`, payload);
    return data;
  },
};

import { backendClient } from '../http/backendClient';
import type { ValidateDto } from '../vigilancia/vigilanciaService';

export interface RecomendacionDto {
  recomendacionId: number;
  titulo: string;
  descripcion?: string;
  tipoPlaga: string;
  productosRecomendados: string;
  reportedByUserId: number;
  createdAt: string;
  statusId: number;
  statusName: string;
  validatedByUserId?: number;
  validatedAt?: string;
}

export interface CreateRecomendacionDto {
  titulo: string;
  descripcion?: string;
  tipoPlaga: string;
  productosRecomendados: string;
}

export const recomendacionesService = {
  async getAll(): Promise<RecomendacionDto[]> {
    const { data } = await backendClient.get<RecomendacionDto[]>('/api/recomendaciones');
    return data;
  },

  async getById(id: number): Promise<RecomendacionDto> {
    const { data } = await backendClient.get<RecomendacionDto>(`/api/recomendaciones/${id}`);
    return data;
  },

  async create(payload: CreateRecomendacionDto): Promise<RecomendacionDto> {
    const { data } = await backendClient.post<RecomendacionDto>('/api/recomendaciones', payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await backendClient.delete(`/api/recomendaciones/${id}`);
  },

  async validate(id: number, payload: ValidateDto): Promise<RecomendacionDto> {
    const { data } = await backendClient.patch<RecomendacionDto>(
      `/api/recomendaciones/${id}/validate`,
      payload
    );
    return data;
  },
};

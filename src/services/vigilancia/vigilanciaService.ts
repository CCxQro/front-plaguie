import { backendClient } from '../http/backendClient';

export interface VigilanciaFitosanitariaDto {
  vigilanciaId: number;
  tipoPlaga: string;
  incidencia: number;
  severidad: number;
  descripcion: string;
  createdAt: string;
  ubicacionId: number;
  reportedByUserId: number;
  statusId: number;
  statusName: string;
  validatedByUserId?: number;
  validatedAt?: string;
}

export interface CreateVigilanciaDto {
  tipoPlaga: string;
  incidencia: number;
  severidad: number;
  descripcion?: string;
  ubicacionId: number;
}

export interface ValidateDto {
  statusId: number;
}

export const vigilanciaService = {
  async getAll(): Promise<VigilanciaFitosanitariaDto[]> {
    const { data } = await backendClient.get<VigilanciaFitosanitariaDto[]>('/api/vigilancias-fitosanitarias');
    return data;
  },

  async getById(id: number): Promise<VigilanciaFitosanitariaDto> {
    const { data } = await backendClient.get<VigilanciaFitosanitariaDto>(`/api/vigilancias-fitosanitarias/${id}`);
    return data;
  },

  async create(payload: CreateVigilanciaDto): Promise<VigilanciaFitosanitariaDto> {
    const { data } = await backendClient.post<VigilanciaFitosanitariaDto>('/api/vigilancias-fitosanitarias', payload);
    return data;
  },

  async delete(id: number): Promise<void> {
    await backendClient.delete(`/api/vigilancias-fitosanitarias/${id}`);
  },

  async validate(id: number, payload: ValidateDto): Promise<VigilanciaFitosanitariaDto> {
    const { data } = await backendClient.patch<VigilanciaFitosanitariaDto>(
      `/api/vigilancias-fitosanitarias/${id}/validate`,
      payload
    );
    return data;
  },
};

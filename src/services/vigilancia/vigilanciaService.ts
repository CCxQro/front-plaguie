import { backendClient } from '../http/backendClient';

export interface VigilanciaFitosanitariaDto {
  vigilanciaFitosanitariaId: number;
  systemMonitoringId?: number;
  systemMonitoringName?: string;
  identificationKeyId?: number;
  identificationKeyName?: string;
  latitude?: number;
  longitude?: number;
  locationId?: number;
  plagueId?: number;
  plagueName?: string;
  hostId?: number;
  hostName?: string;
  varietyId?: number;
  varietyName?: string;
  speciesId?: number;
  speciesName?: string;
  ahosp?: number;
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

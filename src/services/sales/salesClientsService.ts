import { backendClient } from '../http/backendClient';

// ── Map list ──────────────────────────────────────────────────────────────────

export interface ClientMapItem {
  farmerId: number;
  userId: number;
  name: string;
  email: string;
  latitude: number | null;
  longitude: number | null;
  locationId: number | null;
  state: string | null;
  municipality: string | null;
  locality: string | null;
  cultivos: string[];
  estadosParcela: string[];
  parcelasCount: number;
  totalHectareas: number;
  hasActiveAlerts: boolean;
  activeAlertsCount: number;
  maxAlertSeverity: 'critico' | 'advertencia' | 'informacion' | null;
  totalOrders: number;
  lastOrderDate: string | null;
}

export interface ClientMapFilters {
  cultivo?: string;
  estadoParcela?: string;
  state?: string;
  municipality?: string;
  onlyWithActiveAlerts?: boolean;
}

// ── Detail ────────────────────────────────────────────────────────────────────

export interface ClientParcelaSummary {
  parcelaId: number;
  nombreParcela: string;
  tamanoHectareas: number;
  tipoCultivo: string | null;
  estadoParcela: string | null;
  sistemaRiego: string | null;
  phSuelo: number | null;
  fechaSiembra: string | null;
  fechaCosecha: string | null;
}

export interface ClientAlertaSummary {
  alertaId: number;
  titulo: string;
  tipoPlaga: string | null;
  severidad: 'critico' | 'advertencia' | 'informacion';
  hectareas: number;
  createdAt: string;
  statusId: number;
  statusName: string;
  isActive: boolean;
}

export interface ClientOrderSummary {
  totalOrders: number;
  totalAmount: number;
  lastOrderDate: string | null;
  lastOrderStatus: string | null;
}

export interface ClientDetail {
  farmerId: number;
  userId: number;
  name: string;
  email: string;
  isActive: boolean;
  latitude: number | null;
  longitude: number | null;
  state: string | null;
  municipality: string | null;
  locality: string | null;
  property: string | null;
  parcelas: ClientParcelaSummary[];
  alertas: ClientAlertaSummary[];
  orderSummary: ClientOrderSummary | null;
}

// ── Service ───────────────────────────────────────────────────────────────────

export const salesClientsService = {
  async getClientsMap(filters: ClientMapFilters = {}): Promise<ClientMapItem[]> {
    const params = new URLSearchParams();
    if (filters.cultivo) params.set('cultivo', filters.cultivo);
    if (filters.estadoParcela) params.set('estadoParcela', filters.estadoParcela);
    if (filters.state) params.set('state', filters.state);
    if (filters.municipality) params.set('municipality', filters.municipality);
    if (filters.onlyWithActiveAlerts) params.set('onlyWithActiveAlerts', 'true');

    const query = params.toString();
    const { data } = await backendClient.get<ClientMapItem[]>(
      `/api/sales/clients${query ? `?${query}` : ''}`,
    );
    return data;
  },

  async getClientDetail(farmerId: number): Promise<ClientDetail> {
    const { data } = await backendClient.get<ClientDetail>(`/api/sales/clients/${farmerId}`);
    return data;
  },
};

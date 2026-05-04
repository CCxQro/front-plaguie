import type { PlagueAlertCardProps } from '../../components/PlagueAlertCard/PlagueAlertCard';

export interface PlagueAlertsData {
  timestamp: string;
  alerts: PlagueAlertCardProps[];
}

/**
 * Mock plague alerts service — replace with real API calls later.
 * TODO: Replace with actual API endpoint using apiFetch from src/services/api.ts
 */
export const plagueAlertsService = {
  async getAlerts(): Promise<PlagueAlertsData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          timestamp: new Date().toISOString(),
          alerts: [
            {
              variant: 'critico',
              titulo: 'Plaga de Langosta Detectada',
              ubicacion: 'Monterrey, N.L.',
              tiempo: 'Hace 15 min',
              tipoPlaga: 'Langosta',
              hectareas: '50 hectáreas',
            },
            {
              variant: 'critico',
              titulo: 'Gusano Cogollero Activo',
              ubicacion: 'Puebla, Pue.',
              tiempo: 'Hace 30 min',
              tipoPlaga: 'Gusano Cogollero',
              hectareas: '35 hectáreas',
            },
            {
              variant: 'advertencia',
              titulo: 'Infestación de Pulgón',
              ubicacion: 'Ciudad de México',
              tiempo: 'Hace 2 horas',
              tipoPlaga: 'Pulgón',
              hectareas: '15 hectáreas',
            },
            {
              variant: 'advertencia',
              titulo: 'Trips en Cultivos Protegidos',
              ubicacion: 'Tijuana, B.C.',
              tiempo: 'Hace 1 día',
              tipoPlaga: 'Trips',
              hectareas: '12 hectáreas',
            },
            {
              variant: 'informacion',
              titulo: 'Mosca Blanca en Hortalizas',
              ubicacion: 'Guadalajara, Jal.',
              tiempo: 'Hace 4 horas',
              tipoPlaga: 'Mosca Blanca',
              hectareas: '8 hectáreas',
            },
          ],
        });
      }, 300);
    });
  },

  async refreshAlerts(): Promise<PlagueAlertsData> {
    return this.getAlerts();
  },
};

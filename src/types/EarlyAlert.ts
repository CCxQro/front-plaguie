/** Validated early pest alert (last 3 months) near the seller, with its distance.
 *  GET /api/alertas/cercanas?radioKm=… */
export interface EarlyAlert {
  alertaId: number;
  titulo: string;
  descripcion?: string | null;
  ubicacionId: number;
  stateId: number | null;
  stateName: string | null;
  latitude: number | null;
  longitude: number | null;
  /** Distance in km from the seller's location, computed server-side. */
  distanceKm: number | null;
  tipoPlaga: string;
  hectareas: number | null;
  severidad: 'critico' | 'advertencia' | 'informacion' | string;
  reportedByUserId: number | null;
  createdAt: string | null;
  statusId: number;
  statusName: string | null;
  validatedByUserId?: number | null;
  validatedAt?: string | null;
}

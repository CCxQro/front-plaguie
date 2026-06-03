/** A state catalog item for the region selector. GET /api/locations/states */
export interface StateOption {
  stateId: number;
  name: string;
}

/** A seller's configured region of interest. GET /api/regiones-interes */
export interface RegionInteres {
  regionInteresId: number;
  stateId: number;
  stateName: string | null;
  createdAt: string | null;
}

/** Validated early pest alert (last 3 months), enriched with its state.
 *  GET /api/regiones-interes/alertas — filtering is applied client-side. */
export interface EarlyAlert {
  alertaId: number;
  titulo: string;
  descripcion?: string | null;
  ubicacionId: number;
  stateId: number | null;
  stateName: string | null;
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

/** A validated surveillance observation for the pest map. GET /api/vigilancias-fitosanitarias/mapa */
export interface PestMapPoint {
  vigilanciaId: number;
  latitude: number | null;
  longitude: number | null;
  plagaNombre: string | null;
  hospedanteNombre: string | null;
  especieNombre: string | null;
  estadoNombre: string | null;
  municipioNombre: string | null;
  ahosp: number | null;
  validatedAt: string | null;
}

export type RiskLevel = 'Alto' | 'Medio' | 'Bajo';

/** Per-pest breakdown inside a zone. */
export interface ZonePlague {
  nombre: string;
  observaciones: number;
}

/** A zone (municipality) aggregating its surveillance observations. */
export interface PestZone {
  key: string;
  estado: string | null;
  municipio: string | null;
  latitude: number;
  longitude: number;
  totalObservaciones: number;
  plagasDistintas: number;
  nivelRiesgo: RiskLevel;
  plagas: ZonePlague[];
}

export interface PestMapFilters {
  plaga: string; // '' = todas
  estado: string; // '' = todos
  fechaDesde: string; // '' = sin límite (yyyy-mm-dd)
  fechaHasta: string; // '' = sin límite (yyyy-mm-dd)
}

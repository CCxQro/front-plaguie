import type { PestMapFilters, PestMapPoint, PestZone, RiskLevel, ZonePlague } from '../types/PestMap';

/** Risk level from the number of observations in a zone. */
export function riskFromCount(count: number): RiskLevel {
  if (count >= 3) return 'Alto';
  if (count === 2) return 'Medio';
  return 'Bajo';
}

function inDateRange(validatedAt: string | null, desde: string, hasta: string): boolean {
  if (!desde && !hasta) return true;
  if (!validatedAt) return false;
  const t = new Date(validatedAt).getTime();
  if (Number.isNaN(t)) return false;
  if (desde && t < new Date(`${desde}T00:00:00`).getTime()) return false;
  if (hasta && t > new Date(`${hasta}T23:59:59`).getTime()) return false;
  return true;
}

/** Applies the pest/region/date filters to the raw points. */
export function filterPoints(points: PestMapPoint[], filters: PestMapFilters): PestMapPoint[] {
  return points.filter((p) => {
    if (p.latitude == null || p.longitude == null) return false;
    if (filters.plaga && p.plagaNombre !== filters.plaga) return false;
    if (filters.estado && p.estadoNombre !== filters.estado) return false;
    if (!inDateRange(p.validatedAt, filters.fechaDesde, filters.fechaHasta)) return false;
    return true;
  });
}

/** Groups points into zones by (estado, municipio), with centroid + pest breakdown + risk. */
export function aggregateByZone(points: PestMapPoint[]): PestZone[] {
  const groups = new Map<string, PestMapPoint[]>();

  for (const p of points) {
    if (p.latitude == null || p.longitude == null) continue;
    const estado = p.estadoNombre ?? 'Sin estado';
    const municipio = p.municipioNombre ?? 'Sin municipio';
    const key = `${estado}||${municipio}`;
    const bucket = groups.get(key);
    if (bucket) bucket.push(p);
    else groups.set(key, [p]);
  }

  const zones: PestZone[] = [];
  for (const [key, group] of groups) {
    const total = group.length;
    const latitude = group.reduce((s, p) => s + (p.latitude as number), 0) / total;
    const longitude = group.reduce((s, p) => s + (p.longitude as number), 0) / total;

    const plagueCounts = new Map<string, number>();
    for (const p of group) {
      const nombre = p.plagaNombre ?? 'Sin clasificar';
      plagueCounts.set(nombre, (plagueCounts.get(nombre) ?? 0) + 1);
    }
    const plagas: ZonePlague[] = Array.from(plagueCounts, ([nombre, observaciones]) => ({
      nombre,
      observaciones,
    })).sort((a, b) => b.observaciones - a.observaciones);

    zones.push({
      key,
      estado: group[0].estadoNombre,
      municipio: group[0].municipioNombre,
      latitude,
      longitude,
      totalObservaciones: total,
      plagasDistintas: plagas.length,
      nivelRiesgo: riskFromCount(total),
      plagas,
    });
  }

  // Most affected zones first.
  return zones.sort((a, b) => b.totalObservaciones - a.totalObservaciones);
}

/** Distinct pest names present in the points (for the filter dropdown). */
export function distinctPlagues(points: PestMapPoint[]): string[] {
  const set = new Set<string>();
  for (const p of points) if (p.plagaNombre) set.add(p.plagaNombre);
  return Array.from(set).sort();
}

/** Distinct state names present in the points (for the filter dropdown). */
export function distinctStates(points: PestMapPoint[]): string[] {
  const set = new Set<string>();
  for (const p of points) if (p.estadoNombre) set.add(p.estadoNombre);
  return Array.from(set).sort();
}

import { describe, it, expect } from 'vitest';

import {
  aggregateByZone,
  distinctPlagues,
  distinctStates,
  filterPoints,
  riskFromCount,
} from './pestMapAggregation';
import type { PestMapPoint } from '../types/PestMap';

function point(p: Partial<PestMapPoint> & { vigilanciaId: number }): PestMapPoint {
  return {
    latitude: 20.7,
    longitude: -103.4,
    plagaNombre: 'Mosca de la fruta',
    hospedanteNombre: 'Mango',
    especieNombre: null,
    estadoNombre: 'jalisco',
    municipioNombre: 'zapopan',
    ahosp: 10,
    validatedAt: '2026-05-20T10:00:00',
    ...p,
  };
}

describe('pestMapAggregation', () => {
  it('riskFromCount maps counts to levels', () => {
    expect(riskFromCount(1)).toBe('Bajo');
    expect(riskFromCount(2)).toBe('Medio');
    expect(riskFromCount(5)).toBe('Alto');
  });

  it('aggregates points by zone with centroid, breakdown and risk', () => {
    const zones = aggregateByZone([
      point({ vigilanciaId: 1, plagaNombre: 'Mosca de la fruta' }),
      point({ vigilanciaId: 2, plagaNombre: 'Araña roja' }),
      point({ vigilanciaId: 3, plagaNombre: 'Mosca de la fruta' }),
      point({
        vigilanciaId: 4,
        estadoNombre: 'michoacán',
        municipioNombre: 'uruapan',
        plagaNombre: 'Roya asiatica',
      }),
    ]);

    expect(zones).toHaveLength(2);
    // Most affected first → zapopan (3 obs)
    const zapopan = zones[0];
    expect(zapopan.municipio).toBe('zapopan');
    expect(zapopan.totalObservaciones).toBe(3);
    expect(zapopan.nivelRiesgo).toBe('Alto');
    expect(zapopan.plagasDistintas).toBe(2);
    // Dominant pest first
    expect(zapopan.plagas[0]).toEqual({ nombre: 'Mosca de la fruta', observaciones: 2 });

    const uruapan = zones[1];
    expect(uruapan.totalObservaciones).toBe(1);
    expect(uruapan.nivelRiesgo).toBe('Bajo');
  });

  it('filters by pest, state and date range', () => {
    const points = [
      point({ vigilanciaId: 1, plagaNombre: 'Mosca de la fruta', validatedAt: '2026-05-20T10:00:00' }),
      point({ vigilanciaId: 2, plagaNombre: 'Araña roja', validatedAt: '2026-05-20T10:00:00' }),
      point({ vigilanciaId: 3, plagaNombre: 'Mosca de la fruta', validatedAt: '2026-01-01T10:00:00' }),
      point({ vigilanciaId: 4, plagaNombre: 'Mosca de la fruta', estadoNombre: 'sonora' }),
    ];

    expect(filterPoints(points, { plaga: 'Mosca de la fruta', estado: '', fechaDesde: '', fechaHasta: '' }))
      .toHaveLength(3);
    expect(filterPoints(points, { plaga: '', estado: 'sonora', fechaDesde: '', fechaHasta: '' }))
      .toHaveLength(1);
    expect(
      filterPoints(points, { plaga: '', estado: '', fechaDesde: '2026-05-01', fechaHasta: '2026-05-31' })
    ).toHaveLength(3); // excludes the 2026-01 one
  });

  it('lists distinct plagues and states', () => {
    const points = [
      point({ vigilanciaId: 1, plagaNombre: 'Mosca de la fruta', estadoNombre: 'jalisco' }),
      point({ vigilanciaId: 2, plagaNombre: 'Araña roja', estadoNombre: 'michoacán' }),
      point({ vigilanciaId: 3, plagaNombre: 'Mosca de la fruta', estadoNombre: 'jalisco' }),
    ];
    expect(distinctPlagues(points)).toEqual(['Araña roja', 'Mosca de la fruta']);
    expect(distinctStates(points)).toEqual(['jalisco', 'michoacán']);
  });
});

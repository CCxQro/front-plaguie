export type Season = 'primavera' | 'verano' | 'otono' | 'invierno';

export const SEASONS: { value: Season; label: string }[] = [
  { value: 'primavera', label: 'Primavera' },
  { value: 'verano', label: 'Verano' },
  { value: 'otono', label: 'Otoño' },
  { value: 'invierno', label: 'Invierno' },
];

export type RiskLevel = 'Bajo' | 'Medio' | 'Alto' | 'Critico' | string;

export interface PredictivePestPredictionItem {
  plagueName: string | null;
  probability: number | null;
  estimatedPeriod: string | null;
  riskLevel: RiskLevel | null;
  affectedHost: string | null;
  justification: string | null;
  suggestedProduct: string | null;
}

export interface PredictiveHotspot {
  municipio: string;
  estado: string | null;
  observaciones: number;
  plagasDistintas: number;
  nivelRiesgo: string;
}

export interface PredictivePestReport {
  region: string;
  season: string;
  generatedAt: string | null;
  observationsAnalyzed: number;
  executiveSummary: string | null;
  predictions: PredictivePestPredictionItem[];
  hotspots: PredictiveHotspot[];
  recommendations: string[];
}

export interface PredictiveReportQuery {
  region: string;
  season: Season;
}

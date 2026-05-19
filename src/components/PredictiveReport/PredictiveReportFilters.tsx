import { useState, type FormEvent } from 'react';
import { SEASONS, type Season } from '../../types/PredictiveReport';

interface PredictiveReportFiltersProps {
  initialRegion?: string;
  initialSeason?: Season;
  isLoading?: boolean;
  onSubmit: (region: string, season: Season) => void;
}

export function PredictiveReportFilters({
  initialRegion = '',
  initialSeason = 'verano',
  isLoading = false,
  onSubmit,
}: PredictiveReportFiltersProps) {
  const [region, setRegion] = useState(initialRegion);
  const [season, setSeason] = useState<Season>(initialSeason);
  const [touched, setTouched] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched(true);
    if (!region.trim()) {
      return;
    }
    onSubmit(region.trim(), season);
  }

  return (
    <form
      data-testid="predictive-report-filters"
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 grid gap-4 md:grid-cols-[2fr_1fr_auto] md:items-end"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#374151]" htmlFor="predictive-report-region">
          Región (estado o municipio)
        </label>
        <input
          id="predictive-report-region"
          data-testid="input-region"
          type="text"
          value={region}
          onChange={(event) => setRegion(event.target.value)}
          placeholder="Ej. Jalisco, Zapopan, Sonora"
          className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#101828] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#86EFAC]"
        />
        {touched && !region.trim() && (
          <span data-testid="region-error" className="text-xs text-[#B91C1C]">
            La región es requerida
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-[#374151]" htmlFor="predictive-report-season">
          Temporada
        </label>
        <select
          id="predictive-report-season"
          data-testid="select-season"
          value={season}
          onChange={(event) => setSeason(event.target.value as Season)}
          className="rounded-lg border border-[#D1D5DB] bg-white px-3 py-2 text-sm text-[#101828] focus:border-[#16A34A] focus:outline-none focus:ring-2 focus:ring-[#86EFAC]"
        >
          {SEASONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        data-testid="generate-report-button"
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-lg bg-[#16A34A] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#15803D] disabled:cursor-not-allowed disabled:bg-[#9CA3AF]"
      >
        {isLoading ? 'Generando…' : 'Generar reporte'}
      </button>
    </form>
  );
}

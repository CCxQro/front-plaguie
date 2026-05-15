import type { PredictivePestPredictionItem } from '../../types/PredictiveReport';

interface PredictivePredictionsTableProps {
  predictions: PredictivePestPredictionItem[];
}

function riskBadgeClasses(risk: string | null | undefined): string {
  const value = (risk ?? '').toLowerCase();
  if (value === 'critico' || value === 'crítico') {
    return 'bg-[#FEE2E2] text-[#991B1B]';
  }
  if (value === 'alto') {
    return 'bg-[#FEF3C7] text-[#92400E]';
  }
  if (value === 'medio') {
    return 'bg-[#DBEAFE] text-[#1E40AF]';
  }
  if (value === 'bajo') {
    return 'bg-[#DCFCE7] text-[#166534]';
  }
  return 'bg-[#F3F4F6] text-[#374151]';
}

function clampProbability(value: number | null): number {
  if (value == null || Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 100) return 100;
  return Math.round(value);
}

export function PredictivePredictionsTable({ predictions }: PredictivePredictionsTableProps) {
  if (!predictions || predictions.length === 0) {
    return (
      <div
        data-testid="predictions-empty"
        className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center text-sm text-[#6B7280]"
      >
        No hay predicciones disponibles para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div
      data-testid="predictions-table"
      className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E5E7EB] text-sm">
          <thead className="bg-[#F9FAFB] text-[#6B7280] uppercase text-xs tracking-wide">
            <tr>
              <th className="px-4 py-3 text-left font-medium">#</th>
              <th className="px-4 py-3 text-left font-medium">Plaga</th>
              <th className="px-4 py-3 text-left font-medium">Probabilidad</th>
              <th className="px-4 py-3 text-left font-medium">Periodo estimado</th>
              <th className="px-4 py-3 text-left font-medium">Riesgo</th>
              <th className="px-4 py-3 text-left font-medium">Hospedante</th>
              <th className="px-4 py-3 text-left font-medium">Producto sugerido</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] text-[#101828]">
            {predictions.map((prediction, index) => {
              const probability = clampProbability(prediction.probability);
              return (
                <tr
                  key={`${prediction.plagueName ?? 'plaga'}-${index}`}
                  data-testid="prediction-row"
                  className="hover:bg-[#F9FAFB]"
                >
                  <td className="px-4 py-3 text-[#6B7280]">{index + 1}</td>
                  <td className="px-4 py-3 font-medium">
                    {prediction.plagueName ?? '—'}
                    {prediction.justification && (
                      <p className="text-xs font-normal text-[#6B7280] mt-1">
                        {prediction.justification}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 w-48">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold tabular-nums">{probability}%</span>
                      <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
                        <div
                          data-testid="probability-fill"
                          className={`h-full bg-[#16A34A] w-(--fill) [--fill:${probability}%]`}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">{prediction.estimatedPeriod ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span
                      data-testid="risk-badge"
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${riskBadgeClasses(
                        prediction.riskLevel,
                      )}`}
                    >
                      {prediction.riskLevel ?? '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">{prediction.affectedHost ?? '—'}</td>
                  <td className="px-4 py-3">{prediction.suggestedProduct ?? '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import type { PredictiveHotspot } from '../../types/PredictiveReport';

interface PredictiveHotspotsCardProps {
  hotspots: PredictiveHotspot[];
}

function riskClasses(nivel: string): string {
  const v = nivel.toLowerCase();
  if (v === 'alto') return 'bg-[#FEF3C7] text-[#92400E]';
  if (v === 'medio') return 'bg-[#DBEAFE] text-[#1E40AF]';
  return 'bg-[#DCFCE7] text-[#166534]';
}

export function PredictiveHotspotsCard({ hotspots }: PredictiveHotspotsCardProps) {
  if (!hotspots || hotspots.length === 0) return null;

  return (
    <div
      data-testid="hotspots-card"
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-3"
    >
      <h3 className="text-sm font-semibold text-[#101828]">
        Zonas de mayor presión fitosanitaria
      </h3>
      <ol className="space-y-2">
        {hotspots.map((h, i) => (
          <li
            key={`${h.municipio}-${i}`}
            data-testid="hotspot-row"
            className="flex items-center justify-between gap-3 rounded-lg bg-[#F9FAFB] px-4 py-2.5"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="text-xs font-bold text-[#9CA3AF] tabular-nums w-4">{i + 1}</span>
              <div className="min-w-0">
                <p className="text-sm font-medium text-[#101828] truncate">{h.municipio}</p>
                {h.estado && (
                  <p className="text-xs text-[#6B7280] truncate">{h.estado}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-[#6B7280] tabular-nums">
                {h.observaciones} obs · {h.plagasDistintas} plaga{h.plagasDistintas !== 1 ? 's' : ''}
              </span>
              <span
                data-testid="hotspot-risk-badge"
                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${riskClasses(h.nivelRiesgo)}`}
              >
                {h.nivelRiesgo}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

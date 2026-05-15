import type { PredictivePestReport } from '../../types/PredictiveReport';

interface PredictiveReportSummaryProps {
  report: PredictivePestReport;
}

function formatGeneratedAt(value: string | null): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export function PredictiveReportSummary({ report }: PredictiveReportSummaryProps) {
  return (
    <div
      data-testid="predictive-report-summary"
      className="bg-white rounded-xl border border-[#E5E7EB] p-5 space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Región</p>
          <p className="text-base font-semibold text-[#101828]">{report.region}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Temporada</p>
          <p className="text-base font-semibold text-[#101828]">{report.season}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Observaciones analizadas
          </p>
          <p className="text-base font-semibold text-[#101828]">{report.observationsAnalyzed}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">Generado</p>
          <p className="text-base font-semibold text-[#101828]">
            {formatGeneratedAt(report.generatedAt)}
          </p>
        </div>
      </div>

      {report.executiveSummary && (
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
            Resumen ejecutivo
          </p>
          <p className="mt-1 text-sm leading-relaxed text-[#374151]">{report.executiveSummary}</p>
        </div>
      )}
    </div>
  );
}

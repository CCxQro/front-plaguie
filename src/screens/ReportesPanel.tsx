import { useCallback, useState } from 'react';
import { PredictiveReportFilters } from '../components/PredictiveReport/PredictiveReportFilters';
import { PredictiveReportSummary } from '../components/PredictiveReport/PredictiveReportSummary';
import { PredictivePredictionsTable } from '../components/PredictiveReport/PredictivePredictionsTable';
import { PredictiveReportDownloads } from '../components/PredictiveReport/PredictiveReportDownloads';
import { PredictiveHotspotsCard } from '../components/PredictiveReport/PredictiveHotspotsCard';
import { PredictiveRecommendationsCard } from '../components/PredictiveReport/PredictiveRecommendationsCard';
import { usePredictivePestReport } from '../hooks/usePredictivePestReport';
import {
  buildReportFilename,
  downloadPredictiveReportExcel,
  downloadPredictiveReportPdf,
} from '../services/reports/predictiveReportsService';
import type { PredictiveReportQuery, Season } from '../types/PredictiveReport';

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function ReportesPanel() {
  const [query, setQuery] = useState<PredictiveReportQuery | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [isExcelLoading, setIsExcelLoading] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const reportQuery = usePredictivePestReport(query);

  const handleSubmit = useCallback((region: string, season: Season) => {
    setExportError(null);
    setQuery({ region, season });
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (!query) return;
    setExportError(null);
    setIsPdfLoading(true);
    try {
      const blob = await downloadPredictiveReportPdf(query);
      triggerBlobDownload(blob, buildReportFilename(query, 'pdf'));
    } catch (error) {
      setExportError((error as Error).message ?? 'No se pudo descargar el PDF');
    } finally {
      setIsPdfLoading(false);
    }
  }, [query]);

  const handleDownloadExcel = useCallback(async () => {
    if (!query) return;
    setExportError(null);
    setIsExcelLoading(true);
    try {
      const blob = await downloadPredictiveReportExcel(query);
      triggerBlobDownload(blob, buildReportFilename(query, 'xlsx'));
    } catch (error) {
      setExportError((error as Error).message ?? 'No se pudo descargar el Excel');
    } finally {
      setIsExcelLoading(false);
    }
  }, [query]);

  const report = reportQuery.data;
  const hasReport = Boolean(report);

  return (
    <main
      data-testid="reportes-panel"
      className="min-h-full bg-[#F9FAFB] p-6 font-sans space-y-6"
    >
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-[#101828]">Reporte predictivo de plagas</h1>
        <p className="text-sm text-[#6B7280]">
          Consulta y descarga la prediccion de plagas por region y temporada para identificar
          oportunidades de venta.
        </p>
      </header>

      <PredictiveReportFilters
        isLoading={reportQuery.isFetching}
        onSubmit={handleSubmit}
      />

      {reportQuery.isError && (
        <div
          data-testid="report-error"
          className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
        >
          {reportQuery.error instanceof Error
            ? reportQuery.error.message
            : 'Ocurrio un error generando el reporte.'}
        </div>
      )}

      {exportError && (
        <div
          data-testid="export-error"
          className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
        >
          {exportError}
        </div>
      )}

      {reportQuery.isFetching && !hasReport && (
        <div
          data-testid="report-loading"
          className="rounded-xl border border-[#E5E7EB] bg-white p-6 text-sm text-[#6B7280]"
        >
          Generando reporte predictivo. Esto puede tardar unos segundos…
        </div>
      )}

      {hasReport && report && (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-[#101828]">
              Resultados para {report.region} – {report.season}
            </h2>
            <PredictiveReportDownloads
              disabled={!hasReport || reportQuery.isFetching}
              isPdfLoading={isPdfLoading}
              isExcelLoading={isExcelLoading}
              onDownloadPdf={handleDownloadPdf}
              onDownloadExcel={handleDownloadExcel}
            />
          </div>

          <PredictiveReportSummary report={report} />
          <PredictivePredictionsTable predictions={report.predictions ?? []} />
          <PredictiveHotspotsCard hotspots={report.hotspots ?? []} />
          <PredictiveRecommendationsCard recommendations={report.recommendations ?? []} />
        </section>
      )}

      {!hasReport && !reportQuery.isFetching && !reportQuery.isError && (
        <div
          data-testid="report-placeholder"
          className="rounded-xl border border-dashed border-[#D1D5DB] bg-white p-10 text-center text-sm text-[#6B7280]"
        >
          Selecciona una region y temporada para generar el reporte predictivo.
        </div>
      )}
    </main>
  );
}

export default ReportesPanel;

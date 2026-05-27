interface PredictiveReportDownloadsProps {
  isPdfLoading: boolean;
  isExcelLoading: boolean;
  disabled: boolean;
  onDownloadPdf: () => void;
  onDownloadExcel: () => void;
}

export function PredictiveReportDownloads({
  isPdfLoading,
  isExcelLoading,
  disabled,
  onDownloadPdf,
  onDownloadExcel,
}: PredictiveReportDownloadsProps) {
  const baseClasses =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed';

  return (
    <div
      data-testid="predictive-report-downloads"
      className="flex flex-wrap items-center gap-3"
    >
      <button
        type="button"
        data-testid="download-pdf-button"
        onClick={onDownloadPdf}
        disabled={disabled || isPdfLoading}
        className={`${baseClasses} border border-[#DC2626] text-[#DC2626] hover:bg-[#FEF2F2] disabled:border-[#E5E7EB] disabled:text-[#9CA3AF]`}
      >
        {isPdfLoading ? 'Descargando…' : 'Descargar PDF'}
      </button>
      <button
        type="button"
        data-testid="download-excel-button"
        onClick={onDownloadExcel}
        disabled={disabled || isExcelLoading}
        className={`${baseClasses} border border-[#16A34A] text-[#16A34A] hover:bg-[#F0FDF4] disabled:border-[#E5E7EB] disabled:text-[#9CA3AF]`}
      >
        {isExcelLoading ? 'Descargando…' : 'Descargar Excel'}
      </button>
    </div>
  );
}

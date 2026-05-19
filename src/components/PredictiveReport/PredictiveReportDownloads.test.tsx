import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PredictiveReportDownloads } from './PredictiveReportDownloads';

describe('PredictiveReportDownloads', () => {
  it('renders both download buttons with data-testid', () => {
    render(
      <PredictiveReportDownloads
        disabled={false}
        isPdfLoading={false}
        isExcelLoading={false}
        onDownloadPdf={() => undefined}
        onDownloadExcel={() => undefined}
      />,
    );
    expect(screen.getByTestId('predictive-report-downloads')).toBeInTheDocument();
    expect(screen.getByTestId('download-pdf-button')).toBeInTheDocument();
    expect(screen.getByTestId('download-excel-button')).toBeInTheDocument();
  });

  it('invokes the correct callback when buttons are clicked', async () => {
    const onPdf = vi.fn();
    const onExcel = vi.fn();
    render(
      <PredictiveReportDownloads
        disabled={false}
        isPdfLoading={false}
        isExcelLoading={false}
        onDownloadPdf={onPdf}
        onDownloadExcel={onExcel}
      />,
    );

    await userEvent.click(screen.getByTestId('download-pdf-button'));
    await userEvent.click(screen.getByTestId('download-excel-button'));

    expect(onPdf).toHaveBeenCalledTimes(1);
    expect(onExcel).toHaveBeenCalledTimes(1);
  });

  it('disables buttons while loading', () => {
    render(
      <PredictiveReportDownloads
        disabled={false}
        isPdfLoading
        isExcelLoading
        onDownloadPdf={() => undefined}
        onDownloadExcel={() => undefined}
      />,
    );
    expect(screen.getByTestId('download-pdf-button')).toBeDisabled();
    expect(screen.getByTestId('download-excel-button')).toBeDisabled();
  });
});

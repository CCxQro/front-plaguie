import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PredictiveReportFilters } from './PredictiveReportFilters';

describe('PredictiveReportFilters', () => {
  it('renders the filters with data-testid', () => {
    render(<PredictiveReportFilters onSubmit={() => undefined} />);
    expect(screen.getByTestId('predictive-report-filters')).toBeInTheDocument();
    expect(screen.getByTestId('input-region')).toBeInTheDocument();
    expect(screen.getByTestId('select-season')).toBeInTheDocument();
  });

  it('shows an error when the region is empty on submit', async () => {
    const onSubmit = vi.fn();
    render(<PredictiveReportFilters onSubmit={onSubmit} />);

    await userEvent.click(screen.getByTestId('generate-report-button'));

    expect(screen.getByTestId('region-error')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with trimmed region and selected season', async () => {
    const onSubmit = vi.fn();
    render(<PredictiveReportFilters onSubmit={onSubmit} />);

    await userEvent.type(screen.getByTestId('input-region'), '  Jalisco  ');
    await userEvent.selectOptions(screen.getByTestId('select-season'), 'invierno');
    await userEvent.click(screen.getByTestId('generate-report-button'));

    expect(onSubmit).toHaveBeenCalledWith('Jalisco', 'invierno');
  });
});

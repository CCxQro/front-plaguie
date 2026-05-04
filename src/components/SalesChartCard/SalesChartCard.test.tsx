import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SalesChartCard } from './SalesChartCard';

describe('SalesChartCard', () => {
  it('renders the default title', () => {
    render(<SalesChartCard />);
    expect(screen.getByText('Rendimiento de Ventas Recientes')).toBeInTheDocument();
  });

  it('renders custom title', () => {
    render(<SalesChartCard title="Ventas Semanales" />);
    expect(screen.getByText('Ventas Semanales')).toBeInTheDocument();
  });

  it('renders all day labels from default data', () => {
    render(<SalesChartCard />);
    ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'].forEach((day) => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  it('renders custom sales data labels', () => {
    const customData = [
      { label: 'Ene', height: 100, tone: '#75C79E' },
      { label: 'Feb', height: 150, tone: '#75C79E' },
    ];
    render(<SalesChartCard salesData={customData} />);
    expect(screen.getByText('Ene')).toBeInTheDocument();
    expect(screen.getByText('Feb')).toBeInTheDocument();
  });

  it('renders time range label', () => {
    render(<SalesChartCard timeRangeLabel="Últimos 30 días" />);
    expect(screen.getByText('Últimos 30 días')).toBeInTheDocument();
  });

  it('has data-testid attribute', () => {
    render(<SalesChartCard />);
    expect(screen.getByTestId('sales-chart-card')).toBeInTheDocument();
  });
});

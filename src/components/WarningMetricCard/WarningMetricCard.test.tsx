import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WarningMetricCard } from './WarningMetricCard';

describe('WarningMetricCard', () => {
  it('renders with default props', () => {
    render(<WarningMetricCard />);
    expect(screen.getByText('Alertas Inventario')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('items')).toBeInTheDocument();
    expect(screen.getByText('Bajo Stock')).toBeInTheDocument();
  });

  it('renders custom title and value', () => {
    render(<WarningMetricCard title="Productos Vencidos" value="12" unit="productos" />);
    expect(screen.getByText('Productos Vencidos')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('productos')).toBeInTheDocument();
  });

  it('renders custom status badge', () => {
    render(<WarningMetricCard status="Crítico" />);
    expect(screen.getByText('Crítico')).toBeInTheDocument();
  });

  it('has data-testid attribute', () => {
    render(<WarningMetricCard />);
    expect(screen.getByTestId('warning-metric-card')).toBeInTheDocument();
  });
});

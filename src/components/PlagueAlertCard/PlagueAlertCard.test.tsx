import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PlagueAlertCard } from './PlagueAlertCard';

const BASE_PROPS = {
  variant: 'critico' as const,
  titulo: 'Plaga de Langosta',
  ubicacion: 'Monterrey, N.L.',
  tiempo: 'Hace 15 min',
  tipoPlaga: 'Langosta',
  hectareas: '50 hectáreas',
};

describe('PlagueAlertCard', () => {
  it('renders the title', () => {
    render(<PlagueAlertCard {...BASE_PROPS} />);
    expect(screen.getByText('Plaga de Langosta')).toBeInTheDocument();
  });

  it('renders ubicacion and tiempo', () => {
    render(<PlagueAlertCard {...BASE_PROPS} />);
    expect(screen.getByText('Monterrey, N.L.')).toBeInTheDocument();
    expect(screen.getByText('Hace 15 min')).toBeInTheDocument();
  });

  it('shows default severity label for critico', () => {
    render(<PlagueAlertCard {...BASE_PROPS} />);
    expect(screen.getByText('Crítico')).toBeInTheDocument();
  });

  it('shows custom severity label when provided', () => {
    render(<PlagueAlertCard {...BASE_PROPS} etiquetaSeveridad="URGENTE" />);
    expect(screen.getByText('URGENTE')).toBeInTheDocument();
  });

  it('shows default severity label for advertencia', () => {
    render(<PlagueAlertCard {...BASE_PROPS} variant="advertencia" />);
    expect(screen.getByText('Advertencia')).toBeInTheDocument();
  });

  it('shows default severity label for informacion', () => {
    render(<PlagueAlertCard {...BASE_PROPS} variant="informacion" />);
    expect(screen.getByText('Información')).toBeInTheDocument();
  });

  it('renders tipo de plaga and hectáreas', () => {
    render(<PlagueAlertCard {...BASE_PROPS} />);
    expect(screen.getByText('Langosta')).toBeInTheDocument();
    expect(screen.getByText('50 hectáreas')).toBeInTheDocument();
  });

  it('has data-testid attribute', () => {
    render(<PlagueAlertCard {...BASE_PROPS} />);
    expect(screen.getByTestId('plague-alert-card')).toBeInTheDocument();
  });
});

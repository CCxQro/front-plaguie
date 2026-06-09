import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import CardParcela from './CardParcela';

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

describe('CardParcela', () => {
  it('renders the parcela fields and formatted harvest date', () => {
    render(
      <CardParcela
        nombre="Lote Norte"
        tipoSiembra="Maíz"
        hectareas={8}
        cosecha={new Date(2026, 5, 15)}
        inspeccion={new Date()}
      />,
    );
    expect(screen.getByText('Lote Norte')).toBeInTheDocument();
    expect(screen.getByText('Maíz')).toBeInTheDocument();
    expect(screen.getByText('8 hectáreas')).toBeInTheDocument();
    expect(screen.getByText(/Cosecha: 15 Jun 2026/)).toBeInTheDocument();
  });

  it('shows "Hoy" for an inspection today', () => {
    render(<CardParcela nombre="L" tipoSiembra="M" hectareas={1} cosecha={new Date()} inspeccion={new Date()} />);
    expect(screen.getByText(/Última inspección: Hoy/)).toBeInTheDocument();
  });

  it('shows "Hace 1 día" for yesterday', () => {
    render(<CardParcela nombre="L" tipoSiembra="M" hectareas={1} cosecha={new Date()} inspeccion={daysAgo(1)} />);
    expect(screen.getByText(/Hace 1 día/)).toBeInTheDocument();
  });

  it('shows "Hace N días" for several days ago', () => {
    render(<CardParcela nombre="L" tipoSiembra="M" hectareas={1} cosecha={new Date()} inspeccion={daysAgo(5)} />);
    expect(screen.getByText(/Hace 5 días/)).toBeInTheDocument();
  });
});

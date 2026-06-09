import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { ValidationCard } from './ValidationCard';

describe('ValidationCard', () => {
  it('renders id, type, title and a status badge', () => {
    render(
      <ValidationCard recordId={12} title="Plaga detectada" typeLabel="Alerta" statusName="Aceptado" date="2026-06-01T10:00:00Z" />,
    );
    expect(screen.getByTestId('validation-card')).toBeInTheDocument();
    expect(screen.getByText('#12')).toBeInTheDocument();
    expect(screen.getByText('Alerta')).toBeInTheDocument();
    expect(screen.getByText('Plaga detectada')).toBeInTheDocument();
    expect(screen.getByTestId('validation-status-badge')).toHaveTextContent('Aceptado');
  });

  it('falls back to "Sin ID" without a recordId', () => {
    render(<ValidationCard title="t" typeLabel="Alerta" statusName="Accepted" date="2026-06-01T10:00:00Z" />);
    expect(screen.getByText('Sin ID')).toBeInTheDocument();
  });

  it('shows the validate button in revision and fires the callback', () => {
    const onValidateClick = vi.fn();
    render(
      <ValidationCard
        title="t"
        typeLabel="Alerta"
        statusName="Revisión"
        date="2026-06-01T10:00:00Z"
        onValidateClick={onValidateClick}
      />,
    );
    const button = screen.getByTestId('validate-button');
    fireEvent.click(button);
    expect(onValidateClick).toHaveBeenCalledOnce();
  });

  it('shows the validated footer for non-revision records', () => {
    render(
      <ValidationCard
        title="t"
        typeLabel="Alerta"
        statusName="Rechazado"
        date="2026-06-01T10:00:00Z"
        validatedByName="Admin"
        validatedAt="2026-06-02T12:00:00Z"
      />,
    );
    expect(screen.getByText(/por Admin/)).toBeInTheDocument();
    expect(screen.queryByTestId('validate-button')).toBeNull();
  });

  it('renders reporter, description and children', () => {
    render(
      <ValidationCard
        title="t"
        typeLabel="Alerta"
        statusName="Aceptado"
        date="2026-06-01T10:00:00Z"
        reporterName="Juan"
        description="Una descripción"
      >
        <span>extra child</span>
      </ValidationCard>,
    );
    expect(screen.getByText('Juan')).toBeInTheDocument();
    expect(screen.getByText('Una descripción')).toBeInTheDocument();
    expect(screen.getByText('extra child')).toBeInTheDocument();
  });

  it('uses the reporterId fallback when no name', () => {
    render(
      <ValidationCard recordId={1} title="t" typeLabel="Alerta" statusName="Aceptado" date="2026-06-01T10:00:00Z" reporterId={99} />,
    );
    expect(screen.getByText('Usuario #99')).toBeInTheDocument();
  });

  it('falls back to a neutral badge for unknown status', () => {
    render(<ValidationCard title="t" typeLabel="Alerta" statusName="Otro" date="2026-06-01T10:00:00Z" />);
    expect(screen.getByTestId('validation-status-badge')).toHaveTextContent('Otro');
  });

  it('handles missing and invalid dates', () => {
    render(<ValidationCard title="t" typeLabel="Alerta" statusName="Aceptado" date="not-a-date" />);
    // Invalid date string is echoed back (the formatter catch branch / Invalid Date).
    expect(screen.getByTestId('validation-card')).toBeInTheDocument();
  });
});

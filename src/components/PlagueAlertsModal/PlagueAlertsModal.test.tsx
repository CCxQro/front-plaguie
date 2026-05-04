import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { PlagueAlertsModal } from './PlagueAlertsModal';

vi.mock('../../services/plagueAlerts/plagueAlertsService', () => ({
  plagueAlertsService: {
    getAlerts: vi.fn().mockResolvedValue({
      timestamp: new Date().toISOString(),
      alerts: [
        {
          variant: 'critico',
          titulo: 'Test Plaga',
          ubicacion: 'Ciudad de México',
          tiempo: 'Hace 5 min',
          tipoPlaga: 'Langosta',
          hectareas: '10 hectáreas',
        },
      ],
    }),
  },
}));

describe('PlagueAlertsModal', () => {
  it('renders nothing when closed', () => {
    render(<PlagueAlertsModal isOpen={false} onClose={vi.fn()} />);
    expect(screen.queryByTestId('plague-alerts-modal')).not.toBeInTheDocument();
  });

  it('renders the modal when open', () => {
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByTestId('plague-alerts-modal')).toBeInTheDocument();
  });

  it('shows modal title when open', () => {
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} />);
    expect(screen.getByText('Alertas de Plagas Detectadas')).toBeInTheDocument();
  });

  it('loads and displays alerts', async () => {
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} />);
    await waitFor(() => {
      expect(screen.getByText('Test Plaga')).toBeInTheDocument();
    });
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    render(<PlagueAlertsModal isOpen={true} onClose={onClose} />);
    await userEvent.click(screen.getByLabelText('Cerrar modal'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('calls onVerMapaCompleto when footer button is clicked', async () => {
    const onVerMapaCompleto = vi.fn();
    render(<PlagueAlertsModal isOpen={true} onClose={vi.fn()} onVerMapaCompleto={onVerMapaCompleto} />);
    await userEvent.click(screen.getByText('Ver Mapa Completo'));
    expect(onVerMapaCompleto).toHaveBeenCalledOnce();
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('../../hooks/useWeatherData', () => ({ useWeatherData: vi.fn() }));

import { useWeatherData } from '../../hooks/useWeatherData';
import { WeatherModal } from './WeatherModal';
import { createQueryWrapper } from '../../test/queryWrapper';

const hook = vi.mocked(useWeatherData);

const locations = [
  { clientId: 'c1', clientName: 'Cliente Sol', condition: 'Despejado', temperature: 28, humidity: 40, windSpeed: 10, icon: 'sun' },
  { clientId: 'c2', clientName: 'Cliente Nube', condition: 'Nublado', temperature: 20, humidity: 70, windSpeed: 8, icon: 'cloud' },
  { clientId: 'c3', clientName: 'Cliente Lluvia', condition: 'Lluvia ligera', temperature: 18, humidity: 90, windSpeed: 15, icon: 'rain' },
  { clientId: 'c4', clientName: 'Cliente Tormenta', condition: 'Tormenta', temperature: 16, humidity: 95, windSpeed: 30, icon: 'storm' },
];

function renderModal(props = {}) {
  const onClose = vi.fn();
  render(<WeatherModal isOpen onClose={onClose} {...props} />, { wrapper: createQueryWrapper() });
  return { onClose };
}

beforeEach(() => {
  vi.clearAllMocks();
  hook.mockReturnValue({ locations, isLoading: false, isError: false, errorMessage: '' } as never);
});

describe('WeatherModal', () => {
  it('renders nothing when closed', () => {
    hook.mockReturnValue({ locations: [], isLoading: false, isError: false, errorMessage: '' } as never);
    const onClose = vi.fn();
    render(<WeatherModal isOpen={false} onClose={onClose} />, { wrapper: createQueryWrapper() });
    expect(screen.queryByTestId('weather-modal')).toBeNull();
  });

  it('shows the loading state', () => {
    hook.mockReturnValue({ locations: [], isLoading: true, isError: false, errorMessage: '' } as never);
    renderModal();
    expect(screen.getByText(/Cargando datos del clima/i)).toBeInTheDocument();
  });

  it('shows the error state', () => {
    hook.mockReturnValue({ locations: [], isLoading: false, isError: true, errorMessage: 'Falló el clima' } as never);
    renderModal();
    expect(screen.getByText('Falló el clima')).toBeInTheDocument();
  });

  it('renders the locations and rain/storm alerts', () => {
    renderModal();
    expect(screen.getByText('Cliente Sol')).toBeInTheDocument();
    expect(screen.getByText('28°C')).toBeInTheDocument();
    // alerts derived from rain + storm locations
    expect(screen.getByText(/Alerta de precipitaciones — Cliente Lluvia/)).toBeInTheDocument();
    expect(screen.getByText(/Tormenta eléctrica — Cliente Tormenta/)).toBeInTheDocument();
  });

  it('closes and refreshes', () => {
    const { onClose } = renderModal();
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar modal' }));
    expect(onClose).toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
  });
});

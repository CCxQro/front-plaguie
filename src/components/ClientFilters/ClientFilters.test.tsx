import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientFilters, emptyFilterState } from './ClientFilters';
import type { ClientMapItem } from '../../services/sales/salesClientsService';

const sampleClients: ClientMapItem[] = [
  {
    farmerId: 1,
    userId: 1,
    name: 'Rancho Las Flores',
    email: 'a@a.com',
    latitude: 20,
    longitude: -100,
    locationId: 1,
    state: 'Jalisco',
    municipality: 'Guadalajara',
    locality: null,
    cultivos: ['Maíz', 'Trigo'],
    estadosParcela: ['Activa', 'En reposo'],
    parcelasCount: 2,
    totalHectareas: 10,
    hasActiveAlerts: false,
    activeAlertsCount: 0,
    maxAlertSeverity: null,
    totalOrders: 3,
    lastOrderDate: null,
  },
  {
    farmerId: 2,
    userId: 2,
    name: 'Finca La Esperanza',
    email: 'b@b.com',
    latitude: 21,
    longitude: -101,
    locationId: 2,
    state: 'Michoacán',
    municipality: 'Morelia',
    locality: null,
    cultivos: ['Trigo'],
    estadosParcela: ['Activa'],
    parcelasCount: 1,
    totalHectareas: 5,
    hasActiveAlerts: true,
    activeAlertsCount: 1,
    maxAlertSeverity: 'critico',
    totalOrders: 1,
    lastOrderDate: null,
  },
];

describe('ClientFilters', () => {
  const setup = (overrides: Partial<Parameters<typeof ClientFilters>[0]> = {}) => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    render(
      <ClientFilters
        value={emptyFilterState}
        clients={sampleClients}
        totalCount={2}
        filteredCount={2}
        onChange={onChange}
        onReset={onReset}
        {...overrides}
      />,
    );
    return { onChange, onReset };
  };

  it('renders the data-testid root', () => {
    setup();
    expect(screen.getByTestId('client-filters')).toBeInTheDocument();
  });

  it('shows the filtered/total counts', () => {
    setup({ totalCount: 7, filteredCount: 3 });
    expect(screen.getByText(/3/)).toBeInTheDocument();
    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  it('emits onChange when typing in the search input', () => {
    const { onChange } = setup();
    fireEvent.change(screen.getByTestId('client-filters-search'), {
      target: { value: 'rancho' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'rancho' }),
    );
  });

  it('populates cultivo dropdown with unique values from clients', () => {
    setup();
    expect(screen.getByRole('option', { name: 'Maíz' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Trigo' })).toBeInTheDocument();
  });

  it('emits onChange when selecting a cultivo', () => {
    const { onChange } = setup();
    fireEvent.change(screen.getByTestId('client-filters-cultivo'), {
      target: { value: 'Maíz' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ cultivo: 'Maíz' }),
    );
  });

  it('populates state dropdown with unique states from clients (uppercase)', () => {
    setup();
    expect(screen.getByRole('option', { name: 'JALISCO' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'MICHOACÁN' })).toBeInTheDocument();
  });

  it('emits onChange when toggling the alerts-only checkbox', () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByTestId('client-filters-alerts-toggle'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ onlyWithActiveAlerts: true }),
    );
  });

  it('does not show reset button when filters are empty', () => {
    setup();
    expect(screen.queryByTestId('client-filters-reset')).toBeNull();
  });

  it('shows reset button and calls onReset when filters are active', () => {
    const { onReset } = setup({ value: { ...emptyFilterState, search: 'test' } });
    fireEvent.click(screen.getByTestId('client-filters-reset'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});

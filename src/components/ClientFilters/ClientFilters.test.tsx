import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientFilters } from './ClientFilters';
import { emptyFilters } from '../../services/clients/clientsAggregator';

describe('ClientFilters', () => {
  const setup = (overrides: Partial<Parameters<typeof ClientFilters>[0]> = {}) => {
    const onChange = vi.fn();
    const onReset = vi.fn();
    render(
      <ClientFilters
        value={emptyFilters}
        availableStatuses={['Entregado', 'Pendiente']}
        totalClients={10}
        filteredCount={10}
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
    setup({ totalClients: 7, filteredCount: 3 });
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

  it('toggles a status chip on click', () => {
    const { onChange } = setup();
    fireEvent.click(screen.getByTestId('client-filters-status-Entregado'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ statuses: ['Entregado'] }),
    );
  });

  it('removes a status when clicked again', () => {
    const { onChange } = setup({
      value: { ...emptyFilters, statuses: ['Entregado'] },
    });
    fireEvent.click(screen.getByTestId('client-filters-status-Entregado'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ statuses: [] }),
    );
  });

  it('parses numeric inputs to numbers', () => {
    const { onChange } = setup();
    fireEvent.change(screen.getByTestId('client-filters-min-orders'), {
      target: { value: '3' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ minOrders: 3 }),
    );
  });

  it('treats empty numeric input as null', () => {
    const { onChange } = setup({
      value: { ...emptyFilters, minSpent: 100 },
    });
    fireEvent.change(screen.getByTestId('client-filters-min-spent'), {
      target: { value: '' },
    });
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ minSpent: null }),
    );
  });

  it('calls onReset when clicking Limpiar', () => {
    const { onReset } = setup();
    fireEvent.click(screen.getByTestId('client-filters-reset'));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it('shows a fallback when no statuses are available', () => {
    setup({ availableStatuses: [] });
    expect(screen.getByText(/sin estados disponibles/i)).toBeInTheDocument();
  });
});

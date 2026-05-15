import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClientDetailDrawer } from './ClientDetailDrawer';
import type { EnrichedClient } from '../../services/clients/clientsAggregator';

const sampleClient: EnrichedClient = {
  clientId: '7',
  farmerId: 7,
  clientName: 'Rancho Las Flores',
  lat: 19.4326,
  lng: -99.1332,
  totalOrders: 2,
  totalSpent: 1234.5,
  lastOrderDate: '2025-04-15T10:00:00',
  lastOrderStatus: 'Entregado',
  statuses: ['Entregado', 'Pendiente'],
  orders: [
    {
      orderId: 100,
      orderDate: '2025-04-15T10:00:00',
      orderStatusId: 1,
      orderStatusName: 'Entregado',
      totalAmount: 1000,
    },
    {
      orderId: 99,
      orderDate: '2025-02-10T10:00:00',
      orderStatusId: 2,
      orderStatusName: 'Pendiente',
      totalAmount: 234.5,
    },
  ],
};

describe('ClientDetailDrawer', () => {
  it('renders nothing when closed', () => {
    const { container } = render(
      <ClientDetailDrawer client={sampleClient} isOpen={false} onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when client is null', () => {
    const { container } = render(
      <ClientDetailDrawer client={null} isOpen onClose={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the drawer with client name and metrics', () => {
    render(<ClientDetailDrawer client={sampleClient} isOpen onClose={() => {}} />);
    expect(screen.getByTestId('client-detail-drawer')).toBeInTheDocument();
    expect(screen.getByText('Rancho Las Flores')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // total orders
  });

  it('lists every order in the history', () => {
    render(<ClientDetailDrawer client={sampleClient} isOpen onClose={() => {}} />);
    const rows = screen.getAllByTestId('client-detail-order');
    expect(rows).toHaveLength(2);
  });

  it('calls onClose when clicking the close button', () => {
    const onClose = vi.fn();
    render(<ClientDetailDrawer client={sampleClient} isOpen onClose={onClose} />);
    fireEvent.click(screen.getByTestId('client-detail-close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when clicking the overlay', () => {
    const onClose = vi.fn();
    render(<ClientDetailDrawer client={sampleClient} isOpen onClose={onClose} />);
    fireEvent.click(screen.getByTestId('client-detail-overlay'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows an empty-history message when there are no orders', () => {
    const noOrders: EnrichedClient = { ...sampleClient, orders: [], totalOrders: 0 };
    render(<ClientDetailDrawer client={noOrders} isOpen onClose={() => {}} />);
    expect(screen.getByText(/aún no tiene pedidos/i)).toBeInTheDocument();
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';

import { ToastContainer, type ToastMessage } from './Toast';

const message: ToastMessage = {
  id: '1',
  variant: 'success',
  title: 'Guardado',
  description: 'Los cambios se guardaron',
};

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('ToastContainer', () => {
  it('renders nothing when there are no messages', () => {
    render(<ToastContainer messages={[]} onDismiss={vi.fn()} />);
    expect(screen.queryByTestId('toast-container')).toBeNull();
  });

  it('renders a toast with title and description', () => {
    render(<ToastContainer messages={[message]} onDismiss={vi.fn()} />);
    act(() => vi.advanceTimersByTime(10));
    expect(screen.getByTestId('toast-message')).toBeInTheDocument();
    expect(screen.getByText('Guardado')).toBeInTheDocument();
    expect(screen.getByText('Los cambios se guardaron')).toBeInTheDocument();
  });

  it('renders one toast per variant', () => {
    const messages: ToastMessage[] = [
      { id: '1', variant: 'success', title: 'A' },
      { id: '2', variant: 'error', title: 'B' },
      { id: '3', variant: 'info', title: 'C' },
    ];
    render(<ToastContainer messages={messages} onDismiss={vi.fn()} />);
    expect(screen.getAllByTestId('toast-message')).toHaveLength(3);
  });

  it('auto-dismisses after the duration', () => {
    const onDismiss = vi.fn();
    render(<ToastContainer messages={[message]} onDismiss={onDismiss} />);
    act(() => vi.advanceTimersByTime(4000 + 300));
    expect(onDismiss).toHaveBeenCalledWith('1');
  });

  it('dismisses when the close button is clicked', () => {
    const onDismiss = vi.fn();
    render(<ToastContainer messages={[message]} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /cerrar notificación/i }));
    act(() => vi.advanceTimersByTime(300));
    expect(onDismiss).toHaveBeenCalledWith('1');
  });
});

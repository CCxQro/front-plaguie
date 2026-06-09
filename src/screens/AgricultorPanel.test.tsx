import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => mockNavigate }));

const mockLogout = vi.fn();
vi.mock('../services/Contexts/useAuthStore', () => ({
  default: () => ({ user: { name: 'Ana' }, logout: mockLogout }),
}));

import AgricultorPanel from './AgricultorPanel';

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});
afterEach(() => vi.useRealTimers());

describe('AgricultorPanel', () => {
  it('greets the user and shows the initial countdown', () => {
    render(<AgricultorPanel />);
    expect(screen.getByTestId('agricultor-panel')).toHaveTextContent('Hola, Ana');
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('counts down each second', () => {
    render(<AgricultorPanel />);
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.getByText('14')).toBeInTheDocument();
  });

  it('logs out and redirects to login after the countdown', () => {
    render(<AgricultorPanel />);
    act(() => vi.advanceTimersByTime(15000));
    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });
});

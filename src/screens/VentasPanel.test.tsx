import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import VentasPanel from './VentasPanel';

describe('VentasPanel', () => {
  it('renders the sales placeholder content', () => {
    render(<VentasPanel />);
    expect(screen.getByRole('heading', { name: 'Ventas' })).toBeInTheDocument();
    expect(screen.getByText(/gestionar las ventas/i)).toBeInTheDocument();
  });
});

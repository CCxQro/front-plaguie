import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import CardEstado from './CardEstado';

describe('CardEstado', () => {
  it('shows the in-stock state with the available count', () => {
    render(<CardEstado availableCount={42} />);
    expect(screen.getByText('En Stock')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('shows the out-of-stock state when count is zero or less', () => {
    render(<CardEstado availableCount={0} />);
    expect(screen.getByText('Sin Stock')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('defaults the available count to 85', () => {
    render(<CardEstado />);
    expect(screen.getByText('85')).toBeInTheDocument();
  });
});

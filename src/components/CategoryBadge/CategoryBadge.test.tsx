import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CategoryBadge from './CategoryBadge';

describe('CategoryBadge', () => {
  it('renders the label text', () => {
    render(<CategoryBadge label="Fungicidas" color="#8200DB" />);
    expect(screen.getByText('Fungicidas')).toBeInTheDocument();
  });

  it('has data-testid attribute', () => {
    render(<CategoryBadge label="Insecticidas" color="#1447E6" />);
    expect(screen.getByTestId('category-badge')).toBeInTheDocument();
  });

  it('applies custom width class', () => {
    render(<CategoryBadge label="Test" color="#008236" width="w-24" />);
    expect(screen.getByTestId('category-badge')).toHaveClass('w-24');
  });

  it('applies custom height class', () => {
    render(<CategoryBadge label="Test" color="#008236" height="h-8" />);
    expect(screen.getByTestId('category-badge')).toHaveClass('h-8');
  });

  it('defaults to w-auto and h-6', () => {
    render(<CategoryBadge label="Test" color="#CA3500" />);
    const badge = screen.getByTestId('category-badge');
    expect(badge).toHaveClass('w-auto');
    expect(badge).toHaveClass('h-6');
  });
});

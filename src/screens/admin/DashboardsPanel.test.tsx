import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import DashboardsPanel from './DashboardsPanel';

describe('DashboardsPanel', () => {
  it('renders the dashboards placeholder with an "en desarrollo" badge', () => {
    render(<DashboardsPanel />);
    expect(screen.getByTestId('dashboards-panel')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Dashboards' })).toBeInTheDocument();
    expect(screen.getByText('En desarrollo')).toBeInTheDocument();
  });
});

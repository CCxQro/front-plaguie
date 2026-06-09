import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

import { MetricCard } from './MetricCard';
import type { CardData } from '../cardData';

const base: CardData = {
  title: 'Ventas',
  value: '1,200',
  description: 'vs mes anterior',
  trend: '+10%',
};

describe('MetricCard', () => {
  it('renders the default variant with trend and description', () => {
    render(<MetricCard data={base} />);
    expect(screen.getByTestId('metric-card')).toBeInTheDocument();
    expect(screen.getByText('Ventas')).toBeInTheDocument();
    expect(screen.getByText('1,200')).toBeInTheDocument();
    expect(screen.getByText('+10%')).toBeInTheDocument();
    expect(screen.getByText('vs mes anterior')).toBeInTheDocument();
  });

  it('renders the highlight variant', () => {
    render(<MetricCard data={base} variant="highlight" />);
    expect(screen.getByText('1,200')).toBeInTheDocument();
  });

  it('renders the compact variant with custom colors', () => {
    render(
      <MetricCard
        variant="compact"
        data={{ title: 'Total', value: 42, iconBg: '#DBEAFE', iconColor: '#155DFC', valueColor: '#101828' }}
      />,
    );
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders the progress variant with a clamped progress and label', () => {
    render(
      <MetricCard variant="progress" data={{ title: 'Avance', value: '80%', progress: 150, progressLabel: 'casi listo' }} />,
    );
    expect(screen.getByText('casi listo')).toBeInTheDocument();
  });

  it('renders the warning variant', () => {
    render(<MetricCard variant="warning" data={{ title: 'Alertas', value: 3 }} />);
    expect(screen.getByText('Alertas')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PredictivePredictionsTable } from './PredictivePredictionsTable';
import type { PredictivePestPredictionItem } from '../../types/PredictiveReport';

describe('PredictivePredictionsTable', () => {
  it('renders empty state when there are no predictions', () => {
    render(<PredictivePredictionsTable predictions={[]} />);
    expect(screen.getByTestId('predictions-empty')).toBeInTheDocument();
  });

  it('renders one row per prediction with risk badge', () => {
    const predictions: PredictivePestPredictionItem[] = [
      {
        plagueName: 'Pulgon',
        probability: 80,
        estimatedPeriod: 'Junio-Julio',
        riskLevel: 'Alto',
        affectedHost: 'Maiz',
        justification: 'Alta densidad observada',
        suggestedProduct: 'Imidacloprid 70%',
      },
      {
        plagueName: 'Mosca blanca',
        probability: 55,
        estimatedPeriod: 'Verano',
        riskLevel: 'Medio',
        affectedHost: 'Chile',
        justification: null,
        suggestedProduct: null,
      },
    ];

    render(<PredictivePredictionsTable predictions={predictions} />);

    const rows = screen.getAllByTestId('prediction-row');
    expect(rows).toHaveLength(2);
    expect(screen.getByText('Pulgon')).toBeInTheDocument();
    expect(screen.getByText('Mosca blanca')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    const badges = screen.getAllByTestId('risk-badge');
    expect(badges[0]).toHaveTextContent('Alto');
    expect(badges[1]).toHaveTextContent('Medio');
  });

  it('clamps probability values outside [0, 100]', () => {
    render(
      <PredictivePredictionsTable
        predictions={[
          {
            plagueName: 'Trips',
            probability: 150,
            estimatedPeriod: null,
            riskLevel: null,
            affectedHost: null,
            justification: null,
            suggestedProduct: null,
          },
        ]}
      />,
    );
    expect(screen.getByText('100%')).toBeInTheDocument();
  });
});

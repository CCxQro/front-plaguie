import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

import { MapCard, type WeatherMapPoint } from './MapCard';
import type { CardData } from '../cardData';

const data: CardData = {
  title: 'Mapa',
  value: 'Activos',
  description: '5 alertas',
  actionLabel: 'Ver mapa completo',
};

describe('MapCard', () => {
  it('renders the locations variant and fires onLocationsClick (button, map, keyboard)', () => {
    const onLocationsClick = vi.fn();
    render(<MapCard data={data} variant="locations" onLocationsClick={onLocationsClick} />);

    expect(screen.getByTestId('map-card')).toBeInTheDocument();
    expect(screen.getByText('Activos')).toBeInTheDocument();
    expect(screen.getByText('5 alertas')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver mapa completo' }));
    const mapArea = screen.getAllByRole('button').find((b) => b.getAttribute('tabindex') === '0')!;
    fireEvent.click(mapArea);
    fireEvent.keyDown(mapArea, { key: 'Enter' });
    expect(onLocationsClick).toHaveBeenCalledTimes(3);
  });

  it('renders the weather variant with all weather emojis', () => {
    const weatherPoints: WeatherMapPoint[] = [
      { left: '10px', top: '10px', icon: 'sun', temperature: '28°' },
      { left: '20px', top: '20px', icon: 'cloud' },
      { left: '30px', top: '30px', icon: 'rain' },
      { left: '40px', top: '40px', icon: 'storm' },
    ];
    const onWeatherClick = vi.fn();
    render(
      <MapCard data={data} variant="weather" weatherPoints={weatherPoints} onWeatherClick={onWeatherClick} />,
    );
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByText('☁️')).toBeInTheDocument();
    expect(screen.getByText('🌧️')).toBeInTheDocument();
    expect(screen.getByText('⛈️')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Ver mapa completo' }));
    expect(onWeatherClick).toHaveBeenCalled();
  });

  it('renders without handlers (no click wiring)', () => {
    render(<MapCard data={{ title: 'Solo' }} variant="locations" />);
    expect(screen.getByTestId('map-card')).toBeInTheDocument();
  });
});

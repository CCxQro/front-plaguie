import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('./geocodingClient', () => ({ geocodingClient: { get: vi.fn() } }));

import { geocodingClient } from './geocodingClient';
import { reverseGeocode } from './reverseGeocodeService';

const mockGet = vi.mocked(geocodingClient.get);

beforeEach(() => vi.clearAllMocks());

describe('reverseGeocode', () => {
  it('maps a full address to state / municipality / locality', async () => {
    mockGet.mockResolvedValue({
      data: {
        display_name: 'Centro, Monterrey, Nuevo León',
        address: { state: 'Nuevo León', county: 'Monterrey', city: 'Centro' },
      },
    } as never);

    await expect(reverseGeocode(25.6, -100.3)).resolves.toEqual({
      stateName: 'Nuevo León',
      municipalityName: 'Monterrey',
      localityName: 'Centro',
      displayName: 'Centro, Monterrey, Nuevo León',
    });
  });

  it('keeps the higher level when the locality is missing', async () => {
    mockGet.mockResolvedValue({
      data: { address: { state: 'Jalisco', county: 'Zapopan' } },
    } as never);

    const result = await reverseGeocode(20, -103);
    expect(result.stateName).toBe('Jalisco');
    expect(result.municipalityName).toBe('Zapopan');
    expect(result.localityName).toBe('Zapopan'); // falls back to municipality
  });

  it('keeps the lower level when the state is missing', async () => {
    mockGet.mockResolvedValue({ data: { address: { city: 'Mérida' } } } as never);

    const result = await reverseGeocode(21, -89);
    expect(result.stateName).toBe('Mérida'); // falls back to locality
    expect(result.municipalityName).toBe('Mérida');
    expect(result.localityName).toBe('Mérida');
  });

  it('uses town/village fallbacks for the locality and state for the municipality', async () => {
    mockGet.mockResolvedValue({
      data: { address: { state: 'Oaxaca', town: 'Pueblo' } },
    } as never);

    const result = await reverseGeocode(17, -96);
    expect(result.localityName).toBe('Pueblo');
    expect(result.municipalityName).toBe('Oaxaca'); // no county/municipality -> state
  });

  it('returns empty strings when nothing resolves', async () => {
    mockGet.mockResolvedValue({ data: {} } as never);

    await expect(reverseGeocode(0, 0)).resolves.toEqual({
      stateName: '',
      municipalityName: '',
      localityName: '',
      displayName: '',
    });
  });

  it('requests the coordinate from the Nominatim reverse endpoint', async () => {
    mockGet.mockResolvedValue({ data: { address: {} } } as never);

    await reverseGeocode(10, 20);
    expect(mockGet).toHaveBeenCalledWith(
      '/reverse',
      expect.objectContaining({
        params: expect.objectContaining({ lat: 10, lon: 20, format: 'json' }),
      }),
    );
  });
});

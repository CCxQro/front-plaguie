import { describe, it, expect } from 'vitest';
import { geocodingClient } from './geocodingClient';

interface Handler {
  fulfilled: (value: unknown) => unknown;
  rejected: (error: unknown) => unknown;
}

const handlers = (
  geocodingClient.interceptors.response as unknown as { handlers: Handler[] }
).handlers;
const { fulfilled, rejected } = handlers[0];

describe('geocodingClient response interceptor', () => {
  it('passes successful responses through unchanged', () => {
    const response = { data: { address: {} } };
    expect(fulfilled(response)).toBe(response);
  });

  it('normalises the Nominatim error field into an Error', async () => {
    await expect(rejected({ response: { data: { error: 'Unable to geocode' } } })).rejects.toThrow(
      'Unable to geocode',
    );
  });

  it('falls back to the transport error message', async () => {
    await expect(rejected({ message: 'Network Error' })).rejects.toThrow('Network Error');
  });

  it('uses the Spanish fallback when no message is available', async () => {
    await expect(rejected({})).rejects.toThrow('No se pudo obtener la ubicación.');
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';

vi.mock('@microsoft/fetch-event-source', () => ({ fetchEventSource: vi.fn() }));
vi.mock('../services/Contexts/useAuthStore', () => ({
  default: { getState: () => ({ token: 'tok' }) },
}));

import { fetchEventSource } from '@microsoft/fetch-event-source';
import { useIngestionProgress } from './useIngestionProgress';
import { createQueryWrapper } from '../test/queryWrapper';

const fes = vi.mocked(fetchEventSource);

type Handlers = {
  onmessage: (ev: { data: string }) => void;
  onerror: (err: unknown) => number | void;
  onclose: () => void;
};

beforeEach(() => vi.clearAllMocks());

describe('useIngestionProgress', () => {
  it('subscribes to the SSE stream and handles DONE / FAILED / progress / bad messages', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});

    renderHook(() => useIngestionProgress(onSuccess, onError), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(fes).toHaveBeenCalledTimes(1));
    const handlers = fes.mock.calls[0][1] as unknown as Handlers;

    act(() => handlers.onmessage({ data: JSON.stringify({ filename: 'a.csv', status: 'PROCESSING', processed: 1, total: 2 }) }));
    act(() => handlers.onmessage({ data: JSON.stringify({ filename: 'a.csv', status: 'DONE' }) }));
    expect(onSuccess).toHaveBeenCalledWith('Archivo procesado: a.csv');

    act(() => handlers.onmessage({ data: JSON.stringify({ filename: 'b.csv', status: 'FAILED' }) }));
    expect(onError).toHaveBeenCalledWith('Error al procesar: b.csv');

    // malformed JSON hits the parse catch
    act(() => handlers.onmessage({ data: 'not-json' }));

    // reconnect delay + close handler should not throw
    expect(handlers.onerror(new Error('x'))).toBe(5000);
    expect(() => handlers.onclose()).not.toThrow();
  });
});

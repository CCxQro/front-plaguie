import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/products/productsService', () => ({ getProviders: vi.fn() }));

import { getProviders } from '../services/products/productsService';
import { useProviders } from './useProviders';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getProviders);

beforeEach(() => vi.clearAllMocks());

describe('useProviders', () => {
  it('fetches the providers list', async () => {
    mocked.mockResolvedValueOnce([{ providerId: 1, name: 'Prov' }] as never);
    const { result } = renderHook(() => useProviders(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});

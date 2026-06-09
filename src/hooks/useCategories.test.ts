import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

vi.mock('../services/products/productsService', () => ({ getCategories: vi.fn() }));

import { getCategories } from '../services/products/productsService';
import { useCategories } from './useCategories';
import { createQueryWrapper } from '../test/queryWrapper';

const mocked = vi.mocked(getCategories);

beforeEach(() => vi.clearAllMocks());

describe('useCategories', () => {
  it('fetches the category list', async () => {
    mocked.mockResolvedValueOnce([{ id: 1, name: 'Fertilizantes' }] as never);
    const { result } = renderHook(() => useCategories(), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(1);
  });
});

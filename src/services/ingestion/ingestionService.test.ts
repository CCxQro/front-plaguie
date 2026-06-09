import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../http/backendClient', () => ({
  backendClient: { get: vi.fn(), post: vi.fn() },
}));

import { backendClient } from '../http/backendClient';
import { getIngestionRuns, uploadIngestionFile } from './ingestionService';

const get = vi.mocked(backendClient.get);
const post = vi.mocked(backendClient.post);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('ingestionService', () => {
  it('getIngestionRuns hits /api/ingestion/runs', async () => {
    get.mockResolvedValueOnce({ data: [] });
    await getIngestionRuns();
    expect(get).toHaveBeenCalledWith('/api/ingestion/runs');
  });

  it('uploadIngestionFile posts a FormData with the file', async () => {
    post.mockResolvedValueOnce({ data: { status: 'ok', message: 'done' } });
    const file = new File(['a,b,c'], 'data.csv', { type: 'text/csv' });

    const result = await uploadIngestionFile(file);

    expect(post).toHaveBeenCalledTimes(1);
    const [url, body] = post.mock.calls[0];
    expect(url).toBe('/api/ingestion/upload');
    expect(body).toBeInstanceOf(FormData);
    expect((body as FormData).get('file')).toBe(file);
    expect(result.status).toBe('ok');
  });
});

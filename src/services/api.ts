/**
 * Legacy shim — all new code should import from
 * src/services/http/backendClient.ts directly.
 *
 * This re-exports the Axios instance so existing callers keep working
 * while they are migrated one by one.
 */
export { backendClient as apiClient } from './http/backendClient';
export { backendClient } from './http/backendClient';

const DEFAULT_ROUTES: Record<number, string> = {
  1: '/app',
  2: '/agricultor',
  3: '/sales-technician',
};

export const getDefaultRoute = (roleId: number): string =>
  DEFAULT_ROUTES[roleId] ?? '/login';

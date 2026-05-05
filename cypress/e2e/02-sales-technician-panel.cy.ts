// E2E: Sales Technician Panel — key cards are visible
// Requires the app to be running and a sales technician session to be seeded
// in localStorage before the test runs.

const MOCK_AUTH = {
  state: {
    user: { id: '1', name: 'Técnico Demo', email: 'tech@demo.com', roleId: 3 },
    token: 'mock-token',
    isAuthenticated: true,
  },
  version: 0,
};

describe('Sales Technician Panel', () => {
  beforeEach(() => {
    window.localStorage.setItem('auth-storage', JSON.stringify(MOCK_AUTH));
    cy.visit('/sales-technician');
  });

  it('renders the sales technician panel', () => {
    cy.url().should('include', '/sales-technician');
  });

  it('renders the climate map card', () => {
    cy.get('[data-testid="map-card"]').should('have.length.at.least', 1);
  });

  it('renders metric cards', () => {
    cy.get('[data-testid="metric-card"]').should('have.length.at.least', 1);
  });

  it('renders the sales chart card', () => {
    cy.get('[data-testid="sales-chart-card"]').should('exist');
  });

  it('renders the warning metric card', () => {
    cy.get('[data-testid="warning-metric-card"]').should('exist');
  });
});

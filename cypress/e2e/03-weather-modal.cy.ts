// E2E: Weather modal opens and closes from the map card

const MOCK_AUTH = {
  state: {
    user: { id: '1', name: 'Técnico Demo', email: 'tech@demo.com', roleId: 3 },
    token: 'mock-token',
    isAuthenticated: true,
  },
  version: 0,
};

describe('Weather Modal', () => {
  beforeEach(() => {
    window.localStorage.setItem('auth-storage', JSON.stringify(MOCK_AUTH));
    cy.visit('/sales-technician');
  });

  it('weather modal is not visible initially', () => {
    cy.get('[data-testid="weather-modal"]').should('not.exist');
  });

  it('opens the weather modal when clicking "Ver mapa completo" on climate card', () => {
    cy.contains('Ver mapa completo').first().click();
    cy.get('[data-testid="weather-modal"]').should('exist');
  });

  it('closes the weather modal when close button is clicked', () => {
    cy.contains('Ver mapa completo').first().click();
    cy.get('[data-testid="weather-modal"]').should('exist');
    cy.get('[aria-label="Cerrar modal"]').first().click();
    cy.get('[data-testid="weather-modal"]').should('not.exist');
  });
});

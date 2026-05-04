// E2E: Plague alerts modal opens and closes from the incidents map card

const MOCK_AUTH = {
  state: {
    user: { id: '1', name: 'Técnico Demo', email: 'tech@demo.com', roleId: 3 },
    token: 'mock-token',
    isAuthenticated: true,
  },
  version: 0,
};

describe('Plague Alerts Modal', () => {
  beforeEach(() => {
    window.localStorage.setItem('auth-storage', JSON.stringify(MOCK_AUTH));
    cy.visit('/sales-technician');
  });

  it('plague alerts modal is not visible initially', () => {
    cy.get('[data-testid="plague-alerts-modal"]').should('not.exist');
  });

  it('opens the plague alerts modal when clicking the incidentes map card', () => {
    // The second map card is the "Incidentes" card
    cy.get('[data-testid="map-card"]').eq(1).contains('Ver mapa completo').click();
    cy.get('[data-testid="plague-alerts-modal"]').should('exist');
    cy.contains('Alertas de Plagas Detectadas').should('be.visible');
  });

  it('shows plague alert cards inside the modal', () => {
    cy.get('[data-testid="map-card"]').eq(1).contains('Ver mapa completo').click();
    cy.get('[data-testid="plague-alert-card"]').should('have.length.at.least', 1);
  });

  it('closes the plague alerts modal', () => {
    cy.get('[data-testid="map-card"]').eq(1).contains('Ver mapa completo').click();
    cy.get('[aria-label="Cerrar modal"]').click();
    cy.get('[data-testid="plague-alerts-modal"]').should('not.exist');
  });
});

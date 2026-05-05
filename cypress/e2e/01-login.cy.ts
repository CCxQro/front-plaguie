// E2E: Login screen structure and form interaction
describe('Login screen', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('renders the login form', () => {
    cy.get('[data-testid="login-form"]').should('exist');
  });

  it('shows email and password inputs', () => {
    cy.get('[data-testid="input-email"]').should('exist');
    cy.get('[data-testid="input-password"]').should('exist');
  });

  it('allows typing in the email field', () => {
    cy.get('[data-testid="input-email"]').type('test@ejemplo.com');
    cy.get('[data-testid="input-email"]').should('have.value', 'test@ejemplo.com');
  });

  it('allows typing in the password field', () => {
    cy.get('[data-testid="input-password"]').type('secreta123');
    cy.get('[data-testid="input-password"]').should('have.value', 'secreta123');
  });

  it('shows the Plaguie brand on the left panel', () => {
    cy.contains('Plaguie').should('be.visible');
  });
});

// E2E: Unauthenticated users are redirected to /login

describe('Role-based redirects', () => {
  it('redirects unauthenticated users to /login when accessing /app', () => {
    cy.clearLocalStorage();
    cy.visit('/app');
    cy.url().should('include', '/login');
  });

  it('redirects unauthenticated users to /login when accessing /sales-technician', () => {
    cy.clearLocalStorage();
    cy.visit('/sales-technician');
    cy.url().should('include', '/login');
  });

  it('redirects unauthenticated users to /login when accessing /agricultor', () => {
    cy.clearLocalStorage();
    cy.visit('/agricultor');
    cy.url().should('include', '/login');
  });

  it('redirects root path to /login when unauthenticated', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.url().should('include', '/login');
  });

  it('stays on /login when already at /login', () => {
    cy.clearLocalStorage();
    cy.visit('/login');
    cy.url().should('include', '/login');
    cy.get('[data-testid="login-form"]').should('exist');
  });
});

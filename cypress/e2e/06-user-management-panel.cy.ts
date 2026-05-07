// E2E: User Management Panel — admin can see, create, edit, and deactivate users
// Requires the app to be running and an admin session seeded in localStorage.

const ADMIN_AUTH = {
  state: {
    user: { id: '1', name: 'Admin Demo', email: 'admin@demo.com', roleId: 1 },
    token: 'mock-token',
    isAuthenticated: true,
  },
  version: 0,
};

const MOCK_USERS = [
  {
    userId: 1,
    firebaseUuid: 'firebase-uuid-001',
    name: 'Ana García',
    email: 'ana@example.com',
    roleId: 3,
    isActive: true,
  },
  {
    userId: 2,
    firebaseUuid: 'firebase-uuid-002',
    name: 'Carlos López',
    email: 'carlos@example.com',
    roleId: 1,
    isActive: false,
  },
];

describe('User Management Panel', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/users', { statusCode: 200, body: MOCK_USERS }).as('getUsers');
    window.localStorage.setItem('auth-storage', JSON.stringify(ADMIN_AUTH));
    cy.visit('/app/usuarios');
    cy.wait('@getUsers');
  });

  it('renders the user management panel', () => {
    cy.get('[data-testid="gestion-usuarios-panel"]').should('exist');
  });

  it('shows the page heading', () => {
    cy.contains('h1', 'Gestión de Usuarios').should('be.visible');
  });

  it('renders the users table with rows', () => {
    cy.get('[data-testid="users-table"]').should('exist');
    cy.get('[data-testid="user-row"]').should('have.length', MOCK_USERS.length);
  });

  it('displays user name and email in each row', () => {
    cy.contains('Ana García').should('be.visible');
    cy.contains('ana@example.com').should('be.visible');
    cy.contains('Carlos López').should('be.visible');
    cy.contains('carlos@example.com').should('be.visible');
  });

  it('displays active and inactive status badges', () => {
    cy.contains('Activo').should('be.visible');
    cy.contains('Inactivo').should('be.visible');
  });

  it('displays role badges', () => {
    cy.contains('Técnico Vendedor').should('be.visible');
    cy.contains('Administrador').should('be.visible');
  });

  it('filters users by name using the search input', () => {
    cy.get('[data-testid="users-search-input"]').type('ana');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.contains('Ana García').should('be.visible');
    cy.contains('Carlos López').should('not.exist');
  });

  it('clears filter when search is cleared', () => {
    cy.get('[data-testid="users-search-input"]').type('ana');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.get('[data-testid="users-search-input"]').clear();
    cy.get('[data-testid="user-row"]').should('have.length', MOCK_USERS.length);
  });

  it('opens create user modal when button is clicked', () => {
    cy.get('[data-testid="create-user-button"]').click();
    cy.get('[data-testid="create-user-modal"]').should('be.visible');
    cy.contains('Crear Nuevo Usuario').should('be.visible');
  });

  it('closes create user modal on cancel', () => {
    cy.get('[data-testid="create-user-button"]').click();
    cy.get('[data-testid="create-user-modal"]').should('be.visible');
    cy.contains('Cancelar').click();
    cy.get('[data-testid="create-user-modal"]').should('not.exist');
  });

  it('opens user detail modal when view button is clicked', () => {
    cy.intercept('GET', `/api/users/${MOCK_USERS[0].userId}`, {
      statusCode: 200,
      body: MOCK_USERS[0],
    }).as('getUserDetail');

    cy.get('[data-testid="view-user-button"]').first().click();
    cy.wait('@getUserDetail');

    cy.get('[data-testid="user-detail-modal"]').should('be.visible');
    cy.contains('Detalle del Usuario').should('be.visible');
    cy.contains(MOCK_USERS[0].firebaseUuid).should('be.visible');
  });

  it('closes user detail modal on close button', () => {
    cy.intercept('GET', `/api/users/${MOCK_USERS[0].userId}`, {
      statusCode: 200,
      body: MOCK_USERS[0],
    }).as('getUserDetail');

    cy.get('[data-testid="view-user-button"]').first().click();
    cy.wait('@getUserDetail');
    cy.get('[data-testid="user-detail-modal"]').should('be.visible');

    cy.get('[aria-label="Cerrar detalle"]').click();
    cy.get('[data-testid="user-detail-modal"]').should('not.exist');
  });

  it('opens edit modal with user data when edit button is clicked', () => {
    cy.get('[data-testid="edit-user-button"]').first().click();
    cy.get('[data-testid="edit-user-modal"]').should('be.visible');
    cy.contains('Editar Usuario').should('be.visible');
    cy.get('[data-testid="edit-user-modal"] input').should('have.value', MOCK_USERS[0].name);
  });

  it('closes edit modal on cancel', () => {
    cy.get('[data-testid="edit-user-button"]').first().click();
    cy.get('[data-testid="edit-user-modal"]').should('be.visible');
    cy.contains('Cancelar').click();
    cy.get('[data-testid="edit-user-modal"]').should('not.exist');
  });

  it('opens confirm deactivate modal when power button is clicked on active user', () => {
    cy.get(`[aria-label="Desactivar ${MOCK_USERS[0].name}"]`).click();
    cy.get('[data-testid="confirm-deactivate-modal"]').should('be.visible');
    cy.contains('Desactivar Usuario').should('be.visible');
    cy.contains(MOCK_USERS[0].name).should('be.visible');
  });

  it('closes confirm deactivate modal on cancel', () => {
    cy.get(`[aria-label="Desactivar ${MOCK_USERS[0].name}"]`).click();
    cy.get('[data-testid="confirm-deactivate-modal"]').should('be.visible');
    cy.contains('Cancelar').click();
    cy.get('[data-testid="confirm-deactivate-modal"]').should('not.exist');
  });

  it('calls DELETE /api/users/:id and closes confirm modal on deactivate', () => {
    cy.intercept('DELETE', `/api/users/${MOCK_USERS[0].userId}`, {
      statusCode: 204,
    }).as('deactivateUser');
    cy.intercept('GET', '/api/users', {
      statusCode: 200,
      body: [{ ...MOCK_USERS[0], isActive: false }, MOCK_USERS[1]],
    }).as('getUsersRefresh');

    cy.get(`[aria-label="Desactivar ${MOCK_USERS[0].name}"]`).click();
    cy.get('[data-testid="confirm-deactivate-modal"]').should('be.visible');
    cy.contains('button', 'Desactivar').click();

    cy.wait('@deactivateUser');
    cy.get('[data-testid="confirm-deactivate-modal"]').should('not.exist');
  });

  it('calls PUT /api/users/:id to reactivate inactive user without confirm', () => {
    cy.intercept('PUT', `/api/users/${MOCK_USERS[1].userId}`, {
      statusCode: 200,
      body: { ...MOCK_USERS[1], isActive: true },
    }).as('reactivateUser');

    cy.get(`[aria-label="Activar ${MOCK_USERS[1].name}"]`).click();

    cy.wait('@reactivateUser');
    cy.get('[data-testid="confirm-deactivate-modal"]').should('not.exist');
  });
});

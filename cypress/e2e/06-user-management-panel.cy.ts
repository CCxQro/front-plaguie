// E2E: User Management Panel — admin can see, create, edit, deactivate, filter, and page users.
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

function page(content: typeof MOCK_USERS, total = content.length, pages = 1, pageNum = 0) {
  return { content, totalElements: total, totalPages: pages, page: pageNum, size: 10 };
}

describe('User Management Panel', () => {
  beforeEach(() => {
    cy.intercept('GET', { pathname: '/api/users' }, (req) => {
      const { name, roleId, isActive } = req.query as Record<string, string>;
      let results = [...MOCK_USERS];
      if (name) {
        const q = name.toLowerCase();
        results = results.filter(
          (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
        );
      }
      if (roleId) {
        results = results.filter((u) => u.roleId === Number(roleId));
      }
      if (isActive !== undefined && isActive !== '') {
        results = results.filter((u) => u.isActive === (isActive === 'true'));
      }
      req.reply({ statusCode: 200, body: page(results) });
    }).as('getUsers');

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
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.contains('Ana García').should('be.visible');
    cy.contains('Carlos López').should('not.exist');
  });

  it('clears filter when search is cleared', () => {
    cy.get('[data-testid="users-search-input"]').type('ana');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.get('[data-testid="users-search-input"]').clear();
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', MOCK_USERS.length);
  });

  it('filters users by role', () => {
    cy.get('[data-testid="role-filter-select"]').select('1');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.contains('Carlos López').should('be.visible');
    cy.contains('Ana García').should('not.exist');
  });

  it('resets role filter to show all users', () => {
    cy.get('[data-testid="role-filter-select"]').select('1');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', 1);

    cy.get('[data-testid="role-filter-select"]').select('');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', MOCK_USERS.length);
  });

  it('filters users by active status', () => {
    cy.get('[data-testid="status-filter-select"]').select('true');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.contains('Ana García').should('be.visible');
    cy.contains('Carlos López').should('not.exist');
  });

  it('filters users by inactive status', () => {
    cy.get('[data-testid="status-filter-select"]').select('false');
    cy.wait('@getUsers');
    cy.get('[data-testid="user-row"]').should('have.length', 1);
    cy.contains('Carlos López').should('be.visible');
  });

  it('shows pagination controls', () => {
    cy.get('[data-testid="pagination-prev"]').should('exist');
    cy.get('[data-testid="pagination-next"]').should('exist');
    cy.get('[data-testid="pagination-info"]').should('contain', 'Página 1 de 1');
  });

  it('disables prev button on first page', () => {
    cy.get('[data-testid="pagination-prev"]').should('be.disabled');
  });

  it('navigates to next page', () => {
    const page0 = Array.from({ length: 10 }, (_, i) => ({
      ...MOCK_USERS[0],
      userId: i + 1,
      name: `Usuario ${i + 1}`,
      email: `user${i + 1}@example.com`,
    }));
    const page1 = [{ ...MOCK_USERS[1], userId: 11 }];

    cy.intercept('GET', { pathname: '/api/users' }, (req) => {
      const p = Number(req.query.page ?? 0);
      req.reply({
        statusCode: 200,
        body: { content: p === 0 ? page0 : page1, totalElements: 11, totalPages: 2, page: p, size: 10 },
      });
    }).as('getUsersPaged');

    cy.visit('/app/usuarios');
    cy.wait('@getUsersPaged');

    cy.get('[data-testid="pagination-info"]').should('contain', 'Página 1 de 2');
    cy.get('[data-testid="pagination-next"]').should('not.be.disabled').click();
    cy.wait('@getUsersPaged');

    cy.get('[data-testid="pagination-info"]').should('contain', 'Página 2 de 2');
    cy.get('[data-testid="pagination-next"]').should('be.disabled');
    cy.get('[data-testid="pagination-prev"]').should('not.be.disabled');
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

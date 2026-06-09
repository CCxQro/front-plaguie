describe('Admin Actualización de Datos Panel', () => {
  beforeEach(() => {
    // Seed auth storage
    window.localStorage.setItem(
      'auth-storage',
      JSON.stringify({
        state: {
          user: {
            id: 1,
            name: 'Admin User',
            email: 'admin@plaguie.com',
            roleId: 1,
          },
          token: 'fake-admin-token',
        },
        version: 0,
      })
    );

    // Intercept GET runs
    cy.intercept('GET', '/api/ingestion/runs', {
      statusCode: 200,
      body: [
        {
          id: 101,
          startedAt: '2026-06-01T12:00:00Z',
          finishedAt: '2026-06-01T12:05:00Z',
          status: 'COMPLETED',
          filesFound: 1,
          filesProcessed: 1,
          files: [
            {
              filename: 'test_ingestion.csv',
              rowsTotal: 100,
              rowsInserted: 100,
              rowsSkipped: 0,
              status: 'COMPLETED'
            }
          ]
        }
      ]
    }).as('getRuns');

    cy.visit('/app/actualizaciones');
  });

  it('renders the history table and file input', () => {
    cy.wait('@getRuns');
    cy.contains('Actualización de Datos');
    cy.get('[data-testid="history-row"]').should('have.length', 1);
    cy.contains('test_ingestion.csv');
    cy.contains('100'); // inserted rows
    cy.get('[data-testid="file-upload-input"]').should('exist');
    cy.get('[data-testid="upload-button"]').should('be.disabled');
  });

  it('allows uploading a valid CSV file and shows success', () => {
    // Intercept POST upload
    cy.intercept('POST', '/api/ingestion/upload', {
      statusCode: 202,
      body: { status: 'queued', message: 'File queued' }
    }).as('uploadFile');

    // Select file
    cy.get('[data-testid="file-upload-input"]').selectFile({
      contents: Cypress.Buffer.from('id,plaga\n1,pulgón'),
      fileName: 'upload.csv',
      mimeType: 'text/csv'
    });

    cy.get('[data-testid="upload-button"]').should('not.be.disabled').click();

    cy.wait('@uploadFile');
    cy.contains('Archivo en cola').should('be.visible');
  });
});

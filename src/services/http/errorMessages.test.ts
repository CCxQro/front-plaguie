import { describe, it, expect } from 'vitest';
import { resolveErrorMessage, statusFallback } from './errorMessages';

describe('resolveErrorMessage', () => {
  it('keeps a curated Spanish backend message verbatim', () => {
    expect(
      resolveErrorMessage('Ya existe un usuario registrado con este correo electrónico', 409, undefined),
    ).toBe('Ya existe un usuario registrado con este correo electrónico');
  });

  it('translates a known English backend phrase to Spanish', () => {
    expect(resolveErrorMessage('skuSellerId is required', 400, undefined)).toBe(
      'Falta un campo obligatorio.',
    );
    expect(resolveErrorMessage('cantidad must be greater than 0', 400, undefined)).toBe(
      'El valor debe ser mayor que cero.',
    );
    expect(resolveErrorMessage('Email already exists', 409, undefined)).toBe('El correo ya está registrado.');
    expect(resolveErrorMessage('Category already exists', 409, undefined)).toBe('El registro ya existe.');
    expect(resolveErrorMessage('User not found', 404, undefined)).toBe(
      'No se encontró el recurso solicitado.',
    );
    expect(resolveErrorMessage('Unauthorized', 401, undefined)).toBe(
      'No tienes autorización para realizar esta acción.',
    );
    expect(resolveErrorMessage('Forbidden', 403, undefined)).toBe(
      'No tienes permiso para realizar esta acción.',
    );
  });

  it('translates Firebase user-creation errors that leak raw English from the backend', () => {
    expect(
      resolveErrorMessage(
        'Error al crear el usuario en Firebase: The password must be a string with at least 6 characters.',
        500,
        undefined,
      ),
    ).toBe('La contraseña debe tener al menos 6 caracteres.');

    expect(
      resolveErrorMessage(
        'Error al crear el usuario en Firebase: The email address is improperly formatted.',
        500,
        undefined,
      ),
    ).toBe('El correo electrónico no es válido.');

    expect(
      resolveErrorMessage(
        'Error al crear el usuario en Firebase: The email address is already in use by another account.',
        500,
        undefined,
      ),
    ).toBe('El correo ya está registrado.');

    expect(
      resolveErrorMessage('Error al crear el usuario en Firebase: SOMETHING_UNEXPECTED', 500, undefined),
    ).toBe('No se pudo crear el usuario. Revisa el correo y la contraseña e inténtalo de nuevo.');
  });

  it('keeps the backend Spanish Firebase messages verbatim', () => {
    expect(
      resolveErrorMessage('La contraseña no cumple con los requisitos de Firebase', 400, undefined),
    ).toBe('La contraseña no cumple con los requisitos de Firebase');
    expect(resolveErrorMessage('El correo ya está registrado en Firebase', 409, undefined)).toBe(
      'El correo ya está registrado en Firebase',
    );
  });

  it('falls back to a Spanish status message when Axios reports a bare status failure', () => {
    expect(resolveErrorMessage(undefined, 500, 'Request failed with status code 500')).toBe(
      'Ocurrió un error en el servidor. Inténtalo más tarde.',
    );
    expect(resolveErrorMessage(undefined, 404, 'Request failed with status code 404')).toBe(
      'No se encontró el recurso solicitado.',
    );
    expect(resolveErrorMessage(undefined, 502, 'Request failed with status code 502')).toBe(
      'El servidor no está disponible en este momento. Inténtalo más tarde.',
    );
  });

  it('maps a network failure (no response) to the connection message', () => {
    expect(resolveErrorMessage(undefined, undefined, 'Network Error')).toBe(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    );
  });

  it('maps timeouts and cancellations to a Spanish status fallback', () => {
    expect(resolveErrorMessage(undefined, undefined, 'timeout of 5000ms exceeded')).toBe(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    );
    expect(resolveErrorMessage(undefined, undefined, 'canceled')).toBe(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    );
  });

  it('uses the generic fallback for an unknown status with no message', () => {
    expect(resolveErrorMessage(undefined, 418, undefined)).toBe(
      'Ocurrió un error inesperado. Inténtalo de nuevo.',
    );
    expect(resolveErrorMessage(undefined, 418, 'Request failed')).toBe(
      'Ocurrió un error inesperado. Inténtalo de nuevo.',
    );
  });

  it('keeps a non-generic, non-English Axios message as-is', () => {
    expect(resolveErrorMessage(undefined, undefined, 'Algo salió mal')).toBe('Algo salió mal');
  });

  it('translates a recognised phrase even when it only appears in the Axios message', () => {
    expect(resolveErrorMessage(undefined, 404, 'Resource not found')).toBe(
      'No se encontró el recurso solicitado.',
    );
  });

  it('trims whitespace-only backend messages and falls through to the status fallback', () => {
    expect(resolveErrorMessage('   ', 503, 'Request failed with status code 503')).toBe(
      'El servicio no está disponible en este momento. Inténtalo más tarde.',
    );
  });
});

describe('statusFallback', () => {
  it('returns the network message when there is no status', () => {
    expect(statusFallback(undefined)).toBe(
      'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.',
    );
  });

  it('returns the mapped Spanish message for known statuses', () => {
    expect(statusFallback(400)).toBe('La solicitud no es válida. Revisa los datos e inténtalo de nuevo.');
    expect(statusFallback(401)).toBe('Tu sesión no es válida. Inicia sesión de nuevo.');
    expect(statusFallback(429)).toBe('Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.');
  });

  it('returns the generic fallback for an unmapped status', () => {
    expect(statusFallback(418)).toBe('Ocurrió un error inesperado. Inténtalo de nuevo.');
  });
});

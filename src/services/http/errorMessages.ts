/**
 * Centralised Spanish translations for HTTP / transport errors.
 *
 * The backend (back-plaguie) already returns Spanish business messages in a
 * `{ "error": "..." }` body, which we keep verbatim. English only leaks through
 * when there is no structured body — Axios / network failures ("Network Error",
 * "Request failed with status code 500", timeouts) — or for the few backend
 * domains that still emit English validation strings. This module maps those to
 * Spanish so every screen surfaces consistent Spanish errors.
 */

// Known English phrases (backend validation, Firebase, third parties) → Spanish.
// First match wins; all patterns are case-insensitive, so list specific
// patterns before broader ones.
const PHRASE_TRANSLATIONS: Array<{ pattern: RegExp; es: string }> = [
  // Firebase user-creation errors. The backend prefixes these with
  // "Error al crear el usuario en Firebase: " and appends the raw English
  // message from the Firebase Admin SDK; translate the recognised tails first,
  // then catch any remaining Firebase failure with a generic Spanish message.
  {
    pattern: /at least \d+ characters|password (must|should) be|weak[_ ]?password|invalid[_ ]?password/i,
    es: 'La contraseña debe tener al menos 6 caracteres.',
  },
  {
    pattern: /email.*(badly|improperly) formatted|email.*(not valid|invalid|malformed)|invalid[_ ]?email/i,
    es: 'El correo electrónico no es válido.',
  },
  {
    pattern: /email.*already.*(use|exist)|email[_ ]?(already[_ ]?)?exists/i,
    es: 'El correo ya está registrado.',
  },
  {
    pattern: /error al crear el usuario en firebase|error al generar token/i,
    es: 'No se pudo crear el usuario. Revisa el correo y la contraseña e inténtalo de nuevo.',
  },
  // Generic backend validation.
  { pattern: /already exists|already in use/i, es: 'El registro ya existe.' },
  { pattern: /must be greater than 0/i, es: 'El valor debe ser mayor que cero.' },
  { pattern: /\bis required\b/i, es: 'Falta un campo obligatorio.' },
  { pattern: /not found/i, es: 'No se encontró el recurso solicitado.' },
  { pattern: /unauthorized/i, es: 'No tienes autorización para realizar esta acción.' },
  { pattern: /forbidden/i, es: 'No tienes permiso para realizar esta acción.' },
];

// Generic Axios / transport strings that mean "no usable backend message".
const GENERIC_ENGLISH = /^(network error|request failed|timeout|canceled|cancelled|aborted)/i;
const AXIOS_STATUS_FALLBACK = /request failed with status code/i;

// HTTP-status → Spanish fallback when the backend gave no structured message.
const STATUS_MESSAGES: Record<number, string> = {
  400: 'La solicitud no es válida. Revisa los datos e inténtalo de nuevo.',
  401: 'Tu sesión no es válida. Inicia sesión de nuevo.',
  403: 'No tienes permiso para realizar esta acción.',
  404: 'No se encontró el recurso solicitado.',
  408: 'El servidor tardó demasiado en responder. Inténtalo de nuevo.',
  409: 'El registro ya existe o está en conflicto con otro.',
  422: 'Algunos datos no son válidos. Revísalos e inténtalo de nuevo.',
  429: 'Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.',
  500: 'Ocurrió un error en el servidor. Inténtalo más tarde.',
  502: 'El servidor no está disponible en este momento. Inténtalo más tarde.',
  503: 'El servicio no está disponible en este momento. Inténtalo más tarde.',
  504: 'El servidor tardó demasiado en responder. Inténtalo más tarde.',
};

const NETWORK_FALLBACK =
  'No se pudo conectar con el servidor. Revisa tu conexión e inténtalo de nuevo.';
const GENERIC_FALLBACK = 'Ocurrió un error inesperado. Inténtalo de nuevo.';

function translatePhrase(message: string): string | null {
  for (const { pattern, es } of PHRASE_TRANSLATIONS) {
    if (pattern.test(message)) return es;
  }
  return null;
}

function looksEnglishGeneric(message: string): boolean {
  return !message || GENERIC_ENGLISH.test(message) || AXIOS_STATUS_FALLBACK.test(message);
}

/** Spanish message derived solely from the HTTP status (or transport failure). */
export function statusFallback(status?: number): string {
  if (status === undefined) return NETWORK_FALLBACK; // no response → transport failure
  return STATUS_MESSAGES[status] ?? GENERIC_FALLBACK;
}

/**
 * Resolve a user-facing Spanish error message.
 *
 * @param backendMessage value of `response.data.error` / `.message`
 *                       (already curated Spanish when present)
 * @param status         HTTP status code, if any
 * @param axiosMessage   Axios `error.message` (English) — used only as a hint
 */
export function resolveErrorMessage(
  backendMessage: string | undefined,
  status: number | undefined,
  axiosMessage: string | undefined,
): string {
  const backend = backendMessage?.trim();
  if (backend) {
    // The backend gave us a message. If it's a known English phrase, translate
    // it; otherwise it is already curated Spanish, so keep it verbatim.
    return translatePhrase(backend) ?? backend;
  }

  // No structured backend message → translate transport / Axios noise to Spanish.
  const axios = axiosMessage?.trim() ?? '';
  if (looksEnglishGeneric(axios)) {
    return statusFallback(status);
  }
  // A non-generic message from elsewhere — translate if we recognise it, else keep.
  return translatePhrase(axios) ?? axios;
}

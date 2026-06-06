import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Atrapa errores de render en su subárbol y muestra un fallback en lugar de
 * dejar la pantalla en blanco (React desmonta todo el árbol ante una excepción
 * de render no atrapada). Úsalo para envolver vistas que consumen datos del
 * backend cuyo contrato puede variar.
 */
class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary] render error:', error, info.componentStack);
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div
        data-testid="error-boundary"
        className="flex min-h-full flex-col items-center justify-center gap-4 bg-[#F6F7F7] px-8 py-16 text-center"
      >
        <div className="grid h-14 w-14 place-content-center rounded-full bg-[#FEE2E2] text-[#DC2626]">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden="true">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Algo salió mal al cargar esta sección</h2>
          <p className="mt-1 max-w-md text-sm text-[#64748B]">
            Ocurrió un error inesperado al mostrar la información. Puedes reintentar; si el problema
            persiste, contacta al equipo.
          </p>
        </div>
        <button
          type="button"
          onClick={this.handleReload}
          className="rounded-lg bg-[#75C79E] px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#6ab080]"
        >
          Reintentar
        </button>
      </div>
    );
  }
}

export default ErrorBoundary;

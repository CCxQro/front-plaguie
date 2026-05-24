export interface CreateLocationForm {
  stateName: string;
  municipalityName: string;
  localityName: string;
  propertyName: string;
  latitude: string;
  longitude: string;
}

export interface CreateForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  roleId: number;
  location: CreateLocationForm;
}

interface Props {
  form: CreateForm;
  formError: string | null;
  isPending: boolean;
  onChange: (patch: Partial<Omit<CreateForm, 'location'>>) => void;
  onLocationChange: (patch: Partial<CreateLocationForm>) => void;
  onSave: () => void;
  onClose: () => void;
}

const ADMIN_ROLE_ID = 1;

function CreateUserModal({
  form,
  formError,
  isPending,
  onChange,
  onLocationChange,
  onSave,
  onClose,
}: Props) {
  const requiresLocation = form.roleId !== ADMIN_ROLE_ID;
  const inputClass =
    'h-10.5 w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none focus:ring-2 focus:ring-[#00A63E]/15';

  const modalWidthClass = requiresLocation ? 'max-w-3xl' : 'max-w-md';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
      <div
        className={`max-h-full w-full ${modalWidthClass} overflow-y-auto rounded-2xl bg-white p-6 transition-[max-width] duration-300 ease-in-out`}
        data-testid="create-user-modal"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#101828]">Crear Nuevo Usuario</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        {formError ? <p className="mb-4 text-sm text-[#E7000B]">{formError}</p> : null}

        <div className={requiresLocation ? 'grid grid-cols-1 gap-6 md:grid-cols-2' : ''}>
          <div className="space-y-4">
            {requiresLocation ? (
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                Datos del usuario
              </p>
            ) : null}
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#364153]">Nombre Completo</span>
              <input
                value={form.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Ej. Juan Pérez"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#364153]">
                Correo Electrónico
              </span>
              <input
                value={form.email}
                onChange={(e) => onChange({ email: e.target.value })}
                placeholder="juan.perez@empresa.com"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#364153]">Contraseña</span>
              <input
                type="password"
                value={form.password}
                onChange={(e) => onChange({ password: e.target.value })}
                placeholder="Contraseña"
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#364153]">
                Confirmar Contraseña
              </span>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) => onChange({ confirmPassword: e.target.value })}
                placeholder="Repite la contraseña"
                className={`${inputClass} ${
                  form.confirmPassword && form.confirmPassword !== form.password
                    ? 'border-[#E7000B] focus:ring-[#E7000B]/15'
                    : ''
                }`}
              />
              {form.confirmPassword && form.confirmPassword !== form.password ? (
                <span className="mt-1 block text-xs text-[#E7000B]">
                  Las contraseñas no coinciden
                </span>
              ) : null}
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#364153]">Rol</span>
              <select
                value={form.roleId}
                onChange={(e) => onChange({ roleId: Number(e.target.value) })}
                className="h-9.75 w-full rounded-[10px] border border-[#D1D5DC] px-3 text-sm outline-none"
              >
                <option value={1}>Administrador</option>
                <option value={2}>Agricultor</option>
                <option value={3}>Técnico Vendedor</option>
              </select>
            </label>
          </div>

          {requiresLocation ? (
            <div className="space-y-3" data-testid="create-user-location">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
                Ubicación
              </p>
              <p className="text-xs text-[#6A7282]">
                Todos los campos de ubicación son obligatorios para este rol.
              </p>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#364153]">Estado</span>
                <input
                  value={form.location.stateName}
                  onChange={(e) => onLocationChange({ stateName: e.target.value })}
                  placeholder="Ej. Nuevo León"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#364153]">Municipio</span>
                <input
                  value={form.location.municipalityName}
                  onChange={(e) => onLocationChange({ municipalityName: e.target.value })}
                  placeholder="Ej. Monterrey"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#364153]">Localidad</span>
                <input
                  value={form.location.localityName}
                  onChange={(e) => onLocationChange({ localityName: e.target.value })}
                  placeholder="Ej. Centro"
                  className={inputClass}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#364153]">Propiedad</span>
                <input
                  value={form.location.propertyName}
                  onChange={(e) => onLocationChange({ propertyName: e.target.value })}
                  placeholder="Ej. Rancho San Pedro"
                  className={inputClass}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#364153]">Latitud</span>
                  <input
                    type="number"
                    value={form.location.latitude}
                    onChange={(e) => onLocationChange({ latitude: e.target.value })}
                    placeholder="25.6866"
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#364153]">Longitud</span>
                  <input
                    type="number"
                    value={form.location.longitude}
                    onChange={(e) => onLocationChange({ longitude: e.target.value })}
                    placeholder="-100.3161"
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={isPending}
            className="h-10.5 flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white hover:bg-[#008c35] disabled:opacity-60"
          >
            {isPending ? 'Guardando...' : 'Guardar Usuario'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateUserModal;

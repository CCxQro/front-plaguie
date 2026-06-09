import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../../services/admin/users';
import useAuthStore from '../../services/Contexts/useAuthStore';
import type { UpdateUserPayload } from '../../types/DataUser';
import { LocationPicker, type LocationPickerValue } from '../../components/LocationPicker/LocationPicker';

interface LocationForm {
  stateName: string;
  municipalityName: string;
  localityName: string;
  propertyName: string;
  latitude: string;
  longitude: string;
}

const EMPTY_LOCATION: LocationForm = {
  stateName: '',
  municipalityName: '',
  localityName: '',
  propertyName: '',
  latitude: '',
  longitude: '',
};

const ADMIN_ROLE_ID = 1;

interface Props {
  userId: number;
  formError: string | null;
  isPending: boolean;
  onSave: (payload: UpdateUserPayload) => void;
  onClose: () => void;
}

type User = NonNullable<Awaited<ReturnType<typeof getUserById>>>;

interface FormProps extends Omit<Props, 'userId'> {
  user: User;
  isSelf: boolean;
}

function EditUserForm({ user, isSelf, formError, isPending, onSave, onClose }: FormProps) {
  const [name, setName] = useState(user.name);
  const [roleId, setRoleId] = useState(user.roleId);
  const [isActive] = useState(user.isActive);
  const [location, setLocation] = useState<LocationForm>(
    user.location
      ? {
          stateName: user.location.stateName,
          municipalityName: user.location.municipalityName,
          localityName: user.location.localityName,
          propertyName: user.location.propertyName,
          latitude: String(user.location.latitude),
          longitude: String(user.location.longitude),
        }
      : EMPTY_LOCATION,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const requiresLocation = roleId !== ADMIN_ROLE_ID;

  function patchLocation(patch: Partial<LocationForm>) {
    setLocation((prev) => ({ ...prev, ...patch }));
  }

  const pickerValue: LocationPickerValue = {
    latitude: location.latitude ? Number(location.latitude) : null,
    longitude: location.longitude ? Number(location.longitude) : null,
    stateName: location.stateName,
    municipalityName: location.municipalityName,
    localityName: location.localityName,
  };

  const handlePickerChange = (next: LocationPickerValue) =>
    patchLocation({
      latitude: next.latitude != null ? String(next.latitude) : '',
      longitude: next.longitude != null ? String(next.longitude) : '',
      stateName: next.stateName,
      municipalityName: next.municipalityName,
      localityName: next.localityName,
    });

  function handleSave() {
    setValidationError(null);
    const payload: UpdateUserPayload = { name: name.trim(), roleId, isActive };
    if (requiresLocation) {
      const stateName = location.stateName.trim();
      const municipalityName = location.municipalityName.trim();
      const localityName = location.localityName.trim();
      const propertyName = location.propertyName.trim();
      const latitude = parseFloat(location.latitude);
      const longitude = parseFloat(location.longitude);
      if (
        !stateName ||
        !municipalityName ||
        !localityName ||
        !propertyName ||
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        setValidationError(
          'La ubicación es obligatoria para usuarios que no son administradores',
        );
        return;
      }
      payload.location = {
        stateName,
        municipalityName,
        localityName,
        propertyName,
        latitude,
        longitude,
      };
    }
    onSave(payload);
  }

  const inputClass =
    'h-10.5 w-full rounded-lg border border-[#D1D5DC] px-4 text-base outline-none focus:ring-2 focus:ring-[#00A63E]/15';

  return (
    <>
      {validationError ? (
        <p className="mb-4 text-sm text-[#E7000B]">{validationError}</p>
      ) : null}
      {formError ? <p className="mb-4 text-sm text-[#E7000B]">{formError}</p> : null}

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#364153]">Nombre Completo</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#364153]">Rol</span>
          <select
            value={roleId}
            onChange={(e) => setRoleId(Number(e.target.value))}
            disabled={user.roleId === 2 || isSelf}
            className="h-10.5 w-full rounded-lg border border-[#D1D5DC] px-3 text-sm outline-none disabled:opacity-60"
          >
            <option value={1}>Administrador</option>
            <option value={2}>Agricultor</option>
            <option value={3}>Técnico Vendedor</option>
          </select>
          {isSelf ? (
            <p className="mt-1 text-xs text-[#6A7282]">
              No puedes cambiar tu propio rol desde aquí.
            </p>
          ) : user.roleId === 2 ? (
            <p className="mt-1 text-xs text-[#6A7282]">
              El rol Agricultor no puede ser modificado.
            </p>
          ) : null}
        </label>

        {requiresLocation ? (
          <div className="space-y-3 rounded-lg border border-[#E5E7EB] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A7282]">
              Ubicación
            </p>
            {!user.location ? (
              <p className="text-xs text-[#6A7282]">
                Este usuario aún no tiene una ubicación registrada. Selecciónala en el mapa para
                guardar el cambio de rol.
              </p>
            ) : null}

            <label className="block">
              <span className="mb-1 block text-sm font-medium text-[#364153]">Propiedad</span>
              <input
                value={location.propertyName}
                onChange={(e) => patchLocation({ propertyName: e.target.value })}
                className={inputClass}
              />
            </label>

            <LocationPicker value={pickerValue} onChange={handlePickerChange} />
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="h-10.5 flex-1 rounded-lg border border-[#D1D5DC] text-base font-medium text-[#364153]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="h-10.5 flex-1 rounded-lg bg-[#00A63E] text-base font-medium text-white hover:bg-[#008c35] disabled:opacity-60"
        >
          {isPending ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </>
  );
}

function EditUserModal({ userId, formError, isPending, onSave, onClose }: Props) {
  const currentUserId = useAuthStore((s) => s.user?.userId);
  const isSelf = currentUserId === userId;

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    staleTime: 60 * 1000,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
      <div
        className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
        data-testid="edit-user-modal"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#101828]">Editar Usuario</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="grid h-9 w-9 place-content-center rounded-lg hover:bg-[#F3F4F6]"
          >
            ✕
          </button>
        </div>

        {isLoading || !user ? (
          <p className="py-8 text-center text-sm text-[#6A7282]">Cargando...</p>
        ) : (
          <EditUserForm
            user={user}
            isSelf={isSelf}
            formError={formError}
            isPending={isPending}
            onSave={onSave}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}

export default EditUserModal;

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';

import { SearchIcon } from '../../../components/Icons/SearchIcon';
import { PowerIcon } from '../../../components/Icons/PowerIcon';
import { DataTableActionIcon } from '../../../components/DataTable/DataTableIcons';
import {
  getUsers,
  registerUser,
  updateUserById,
  deactivateUserById,
} from '../../../services/admin/users';
import { getInitials } from '../../../utils/getInitials';
import type { DataUser, RegisterUserPayload, UpdateUserPayload, UserListParams } from '../../../types/DataUser';
import { roleBadgeClasses, roleIdToLabel } from './roleUtils';
import UserDetailModal from './UserDetailModal';
import CreateUserModal from './CreateUserModal';
import EditUserModal from './EditUserModal';
import ConfirmDeactivateModal from './ConfirmDeactivateModal';
import ConfirmActivateModal from './ConfirmActivateModal';
import PendingAccountsPanel from './PendingAccountsPanel';
import type { CreateForm } from './CreateUserModal';

const PAGE_SIZE = 10;

// Firebase requires passwords of at least 6 characters; validate client-side so
// the user gets immediate Spanish feedback instead of a Firebase round-trip.
const MIN_PASSWORD_LENGTH = 6;

const EMPTY_LOCATION_FORM = {
  stateName: '',
  municipalityName: '',
  localityName: '',
  propertyName: '',
  latitude: '',
  longitude: '',
};

const EMPTY_CREATE_FORM: CreateForm = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  roleId: 3,
  location: EMPTY_LOCATION_FORM,
};

function GestionUsuariosPanel() {
  const queryClient = useQueryClient();

  const [nameSearch, setNameSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<number | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(0);

  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<DataUser | null>(null);
  const [confirmActivateTarget, setConfirmActivateTarget] = useState<DataUser | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<CreateForm>(EMPTY_CREATE_FORM);

  const queryParams: UserListParams = {
    page,
    size: PAGE_SIZE,
    ...(nameSearch.trim() ? { name: nameSearch.trim() } : {}),
    ...(roleFilter !== undefined ? { roleId: roleFilter } : {}),
    ...(statusFilter !== undefined ? { isActive: statusFilter } : {}),
  };

  const {
    data,
    isLoading,
    error: listError,
  } = useQuery({
    queryKey: ['users', queryParams],
    queryFn: () => getUsers(queryParams),
    staleTime: 60 * 1000,
    placeholderData: keepPreviousData,
  });

  const users = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const createMutation = useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreatingUser(false);
      setCreateForm(EMPTY_CREATE_FORM);
      setFormError(null);
    },
    onError: (error) =>
      setFormError(error instanceof Error ? error.message : 'No se pudo crear usuario'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateUserPayload }) =>
      updateUserById(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      void queryClient.invalidateQueries({ queryKey: ['user'] });
      setEditingUserId(null);
      setFormError(null);
    },
    onError: (error) =>
      setFormError(error instanceof Error ? error.message : 'No se pudo actualizar usuario'),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: number) => deactivateUserById(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      setConfirmTarget(null);
    },
    onError: (error) =>
      setFormError(error instanceof Error ? error.message : 'No se pudo desactivar usuario'),
  });

  const reactivateMutation = useMutation({
    mutationFn: (id: number) => updateUserById(id, { isActive: true }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      setConfirmActivateTarget(null);
    },
    onError: (error) =>
      setFormError(error instanceof Error ? error.message : 'No se pudo reactivar usuario'),
  });

  const listErrorMessage = listError instanceof Error ? listError.message : null;

  const openCreateModal = () => {
    setCreateForm(EMPTY_CREATE_FORM);
    setFormError(null);
    setIsCreatingUser(true);
  };

  const openEditModal = (user: DataUser) => {
    setFormError(null);
    setEditingUserId(user.userId);
  };

  const handleNameChange = (value: string) => {
    setNameSearch(value);
    setPage(0);
  };

  const handleRoleChange = (value: string) => {
    setRoleFilter(value ? Number(value) : undefined);
    setPage(0);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value === '' ? undefined : value === 'true');
    setPage(0);
  };

  const handleCreateUser = () => {
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setFormError('Nombre, correo y contraseña son obligatorios');
      return;
    }

    if (!createForm.confirmPassword) {
      setFormError('Debes confirmar la contraseña');
      return;
    }

    if (createForm.password !== createForm.confirmPassword) {
      setFormError('Las contraseñas no coinciden');
      return;
    }

    if (createForm.password.length < MIN_PASSWORD_LENGTH) {
      setFormError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    const payload: RegisterUserPayload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      roleId: createForm.roleId,
    };

    if (createForm.roleId !== 1) {
      const stateName = createForm.location.stateName.trim();
      const municipalityName = createForm.location.municipalityName.trim();
      const localityName = createForm.location.localityName.trim();
      const propertyName = createForm.location.propertyName.trim();
      const latitude = parseFloat(createForm.location.latitude);
      const longitude = parseFloat(createForm.location.longitude);

      if (
        !stateName ||
        !municipalityName ||
        !localityName ||
        !propertyName ||
        Number.isNaN(latitude) ||
        Number.isNaN(longitude)
      ) {
        setFormError('La ubicación es obligatoria para este rol');
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

    createMutation.mutate(payload);
  };

  const handleSaveEditUser = (payload: UpdateUserPayload) => {
    if (!editingUserId) return;
    if (!payload.name?.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }
    updateMutation.mutate({ id: editingUserId, payload });
  };

  const handleToggleActive = (user: DataUser) => {
    if (user.isActive) {
      setConfirmTarget(user);
    } else {
      setConfirmActivateTarget(user);
    }
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deactivateMutation.isPending ||
    reactivateMutation.isPending;

  const startItem = totalElements === 0 ? 0 : page * PAGE_SIZE + 1;
  const endItem = Math.min((page + 1) * PAGE_SIZE, totalElements);

  return (
    <>
      <div className="flex flex-1 flex-col bg-[#F9FAFB]" data-testid="gestion-usuarios-panel">
        <main className="flex-1 overflow-y-auto px-8 py-8">
          <PendingAccountsPanel />

          <section className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-[30px] font-bold leading-9 text-[#101828]">
                Gestión de Usuarios
              </h1>
              <p className="mt-2 text-base text-[#4A5565]">
                Administra los usuarios y sus permisos en la plataforma.
              </p>
            </div>
            <button
              type="button"
              onClick={openCreateModal}
              data-testid="create-user-button"
              className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-[#00A63E] px-6 text-base font-medium text-white hover:bg-[#008c35]"
            >
              <span className="text-lg leading-none">+</span>
              Crear Usuario
            </button>
          </section>

          {/* Filter bar */}
          <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative block sm:flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input
                value={nameSearch}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Buscar usuario por nombre o correo..."
                data-testid="users-search-input"
                className="h-12.5 w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-12 pr-4 text-base text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
              />
            </label>

            <select
              value={roleFilter ?? ''}
              onChange={(e) => handleRoleChange(e.target.value)}
              data-testid="role-filter-select"
              className="h-12.5 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15 sm:w-48"
            >
              <option value="">Todos los roles</option>
              <option value="1">Administrador</option>
              <option value="2">Agricultor</option>
              <option value="3">Técnico Vendedor</option>
            </select>

            <select
              value={statusFilter === undefined ? '' : String(statusFilter)}
              onChange={(e) => handleStatusChange(e.target.value)}
              data-testid="status-filter-select"
              className="h-12.5 rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#364153] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15 sm:w-44"
            >
              <option value="">Todos los estados</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </section>

          <section className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="overflow-x-auto">
              {listErrorMessage ? (
                <p className="px-6 pt-5 text-sm text-[#E7000B]">{listErrorMessage}</p>
              ) : null}
              <table className="w-full min-w-255 border-collapse" data-testid="users-table">
                <thead className="bg-[#F9FAFB]">
                  <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-[0.6px] text-[#6A7282]">
                    <th className="px-6 py-4 font-medium">#ID</th>
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Rol</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((row) => (
                    <tr
                      key={row.userId}
                      data-testid="user-row"
                      className="border-b border-[#E5E7EB] last:border-b-0"
                    >
                      <td className="px-6 py-4">
                        <span className="rounded-md bg-[#F3F4F6] px-2 py-1 text-xs font-mono font-medium text-[#4A5565]">
                          #{row.userId}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-content-center rounded-full bg-[linear-gradient(135deg,#05DF72_0%,#00A63E_100%)] text-base font-medium text-white">
                            {getInitials(row.name)}
                          </div>
                          <p className="text-base font-medium text-[#101828]">{row.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base text-[#4A5565]">{row.email}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${roleBadgeClasses(row.roleId)}`}
                        >
                          {roleIdToLabel(row.roleId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                            row.isActive
                              ? 'bg-[#DCFCE7] text-[#016630]'
                              : 'bg-[#F3F4F6] text-[#1E2939]'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${row.isActive ? 'bg-[#00C950]' : 'bg-[#6A7282]'}`}
                          />
                          {row.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewingUserId(row.userId)}
                            data-testid="view-user-button"
                            aria-label={`Ver detalle de ${row.name}`}
                            className="grid h-8 w-8 place-content-center rounded-[10px] text-[#155DFC] hover:bg-[#EFF6FF]"
                          >
                            <DataTableActionIcon icon="ver" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            data-testid="edit-user-button"
                            aria-label={`Editar ${row.name}`}
                            className="grid h-8 w-8 place-content-center rounded-[10px] text-[#4A5565] hover:bg-[#F3F4F6]"
                          >
                            <DataTableActionIcon icon="editar" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(row)}
                            data-testid="toggle-user-button"
                            aria-label={row.isActive ? `Desactivar ${row.name}` : `Activar ${row.name}`}
                            disabled={isMutating}
                            className={`grid h-8 w-8 place-content-center rounded-[10px] disabled:opacity-40 ${
                              row.isActive
                                ? 'text-[#F54900] hover:bg-[#FFF7ED]'
                                : 'text-[#00A63E] hover:bg-[#DCFCE7]'
                            }`}
                          >
                            <PowerIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading ? (
                <p className="px-6 py-4 text-sm text-[#6A7282]">Cargando usuarios...</p>
              ) : null}
            </div>
          </section>

          {/* Pagination footer */}
          <div className="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#6A7282]" data-testid="pagination-summary">
              {totalElements === 0
                ? 'Sin resultados'
                : `Mostrando ${startItem}–${endItem} de ${totalElements} usuarios`}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 0}
                data-testid="pagination-prev"
                className="h-9 rounded-[10px] border border-[#D1D5DC] px-4 text-sm font-medium text-[#364153] hover:bg-[#F9FAFB] disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-sm text-[#6A7282]" data-testid="pagination-info">
                Página {page + 1} de {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                data-testid="pagination-next"
                className="h-9 rounded-[10px] border border-[#D1D5DC] px-4 text-sm font-medium text-[#364153] hover:bg-[#F9FAFB] disabled:opacity-40"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </main>
      </div>

      {viewingUserId !== null ? (
        <UserDetailModal
          userId={viewingUserId}
          onClose={() => setViewingUserId(null)}
        />
      ) : null}

      {isCreatingUser ? (
        <CreateUserModal
          form={createForm}
          formError={formError}
          isPending={createMutation.isPending}
          onChange={(patch) => setCreateForm((prev) => ({ ...prev, ...patch }))}
          onLocationChange={(patch) =>
            setCreateForm((prev) => ({ ...prev, location: { ...prev.location, ...patch } }))
          }
          onSave={handleCreateUser}
          onClose={() => setIsCreatingUser(false)}
        />
      ) : null}

      {editingUserId !== null ? (
        <EditUserModal
          userId={editingUserId}
          formError={formError}
          isPending={updateMutation.isPending}
          onSave={handleSaveEditUser}
          onClose={() => setEditingUserId(null)}
        />
      ) : null}

      {confirmTarget ? (
        <ConfirmDeactivateModal
          target={confirmTarget}
          isPending={deactivateMutation.isPending}
          onConfirm={() => deactivateMutation.mutate(confirmTarget.userId)}
          onClose={() => setConfirmTarget(null)}
        />
      ) : null}

      {confirmActivateTarget ? (
        <ConfirmActivateModal
          target={confirmActivateTarget}
          isPending={reactivateMutation.isPending}
          onConfirm={() => reactivateMutation.mutate(confirmActivateTarget.userId)}
          onClose={() => setConfirmActivateTarget(null)}
        />
      ) : null}
    </>
  );
}

export default GestionUsuariosPanel;

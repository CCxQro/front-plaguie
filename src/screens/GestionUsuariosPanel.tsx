import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { SearchIcon } from '../components/Icons/SearchIcon';
import { BellIcon } from '../components/Icons/BellIcon';
import { PowerIcon } from '../components/Icons/PowerIcon';
import { DataTableActionIcon } from '../components/DataTable/DataTableIcons';
import {
  getUsers,
  getUserById,
  registerUser,
  updateUserById,
  deactivateUserById,
} from '../services/admin/users';
import type { AdminUser, RegisterUserPayload, UpdateUserPayload } from '../types/AdminUser';

type RoleLabel = 'Administrador' | 'Agricultor' | 'Técnico Vendedor';

function roleIdToLabel(roleId: number): RoleLabel {
  if (roleId === 1) return 'Administrador';
  if (roleId === 2) return 'Agricultor';
  return 'Técnico Vendedor';
}


function roleBadgeClasses(roleId: number): string {
  if (roleId === 1) return 'bg-[#EFF6FF] text-[#1D4ED8]';
  if (roleId === 2) return 'bg-[#DCFCE7] text-[#016630]';
  return 'bg-[#F3E8FF] text-[#6D28D9]';
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AP';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function GestionUsuariosPanel() {
  const queryClient = useQueryClient();

  const [headerSearch, setHeaderSearch] = useState('');
  const [usersSearch, setUsersSearch] = useState('');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [viewingUserId, setViewingUserId] = useState<number | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    roleId: 3,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    roleId: 3,
    isActive: true,
  });

  const {
    data: users = [],
    isLoading,
    error: listError,
  } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
    staleTime: 60 * 1000,
  });

  const { data: viewingUser, isLoading: isLoadingDetail } = useQuery({
    queryKey: ['user', viewingUserId],
    queryFn: () => getUserById(viewingUserId!),
    enabled: viewingUserId !== null,
    staleTime: 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (payload: RegisterUserPayload) => registerUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsCreatingUser(false);
      setCreateForm({ name: '', email: '', password: '', roleId: 3 });
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
      setEditingUser(null);
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
    },
    onError: (error) =>
      setFormError(error instanceof Error ? error.message : 'No se pudo reactivar usuario'),
  });

  const filteredUsers = useMemo(() => {
    const query = usersSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query));
  }, [usersSearch, users]);

  const listErrorMessage = listError instanceof Error ? listError.message : null;

  const openCreateModal = () => {
    setCreateForm({ name: '', email: '', password: '', roleId: 3 });
    setFormError(null);
    setIsCreatingUser(true);
  };

  const openEditModal = (user: AdminUser) => {
    setEditForm({ name: user.name, roleId: user.roleId, isActive: user.isActive });
    setFormError(null);
    setEditingUser(user);
  };

  const handleCreateUser = () => {
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setFormError('Nombre, correo y contraseña son obligatorios');
      return;
    }
    createMutation.mutate({
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      roleId: createForm.roleId,
    });
  };

  const handleSaveEditUser = () => {
    if (!editingUser) return;
    if (!editForm.name.trim()) {
      setFormError('El nombre es obligatorio');
      return;
    }
    updateMutation.mutate({
      id: editingUser.userId,
      payload: {
        name: editForm.name.trim(),
        roleId: editForm.roleId,
        isActive: editForm.isActive,
      },
    });
  };

  const handleToggleActive = (user: AdminUser) => {
    if (user.isActive) {
      setConfirmTarget(user);
    } else {
      reactivateMutation.mutate(user.userId);
    }
  };

  const handleConfirmDeactivate = () => {
    if (!confirmTarget) return;
    deactivateMutation.mutate(confirmTarget.userId);
  };

  const isMutating =
    createMutation.isPending ||
    updateMutation.isPending ||
    deactivateMutation.isPending ||
    reactivateMutation.isPending;

  return (
    <>
      <div className="flex flex-1 flex-col bg-[#F9FAFB]" data-testid="gestion-usuarios-panel">
        <header className="border-b border-[#E5E7EB] bg-white px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <label className="relative block w-full max-w-2xl">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input
                value={headerSearch}
                onChange={(e) => setHeaderSearch(e.target.value)}
                placeholder="Buscar en el sistema..."
                className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-10 pr-4 text-base text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
              />
            </label>
            <button
              type="button"
              className="relative grid h-10 w-10 place-content-center rounded-[10px] text-[#4A5565] hover:bg-[#F3F4F6]"
            >
              <BellIcon />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FB2C36]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8">
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

          <section className="mb-6">
            <label className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input
                value={usersSearch}
                onChange={(e) => setUsersSearch(e.target.value)}
                placeholder="Buscar usuario por nombre o correo..."
                data-testid="users-search-input"
                className="h-12.5 w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-12 pr-4 text-base text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
              />
            </label>
          </section>

          <section className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="overflow-x-auto">
              {listErrorMessage ? (
                <p className="px-6 pt-5 text-sm text-[#E7000B]">{listErrorMessage}</p>
              ) : null}
              <table className="w-full min-w-255 border-collapse" data-testid="users-table">
                <thead className="bg-[#F9FAFB]">
                  <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-[0.6px] text-[#6A7282]">
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Rol</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((row) => (
                    <tr
                      key={row.userId}
                      data-testid="user-row"
                      className="border-b border-[#E5E7EB] last:border-b-0"
                    >
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

          <p className="mt-6 text-sm text-[#6A7282]">
            Mostrando {filteredUsers.length} de {users.length} usuarios registrados
          </p>
        </main>
      </div>

      {/* User Detail Modal */}
      {viewingUserId !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
          <div
            className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
            data-testid="user-detail-modal"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#101828]">Detalle del Usuario</h2>
              <button
                type="button"
                onClick={() => setViewingUserId(null)}
                aria-label="Cerrar detalle"
                className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
              >
                ✕
              </button>
            </div>

            {isLoadingDetail || !viewingUser ? (
              <p className="py-8 text-center text-sm text-[#6A7282]">Cargando...</p>
            ) : (
              <div className="space-y-5">
                <div className="flex items-center gap-4">
                  <div className="grid h-16 w-16 shrink-0 place-content-center rounded-full bg-[linear-gradient(135deg,#05DF72_0%,#00A63E_100%)] text-xl font-semibold text-white">
                    {getInitials(viewingUser.name)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[#101828]">{viewingUser.name}</p>
                    <p className="text-sm text-[#4A5565]">{viewingUser.email}</p>
                  </div>
                </div>

                <div className="space-y-3 rounded-[10px] border border-[#E5E7EB] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#6A7282]">Rol</span>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${roleBadgeClasses(viewingUser.roleId)}`}
                    >
                      {roleIdToLabel(viewingUser.roleId)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[#6A7282]">Estado</span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                        viewingUser.isActive
                          ? 'bg-[#DCFCE7] text-[#016630]'
                          : 'bg-[#F3F4F6] text-[#1E2939]'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${viewingUser.isActive ? 'bg-[#00C950]' : 'bg-[#6A7282]'}`}
                      />
                      {viewingUser.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="shrink-0 text-sm font-medium text-[#6A7282]">ID</span>
                    <span className="truncate font-mono text-xs text-[#4A5565]">
                      {viewingUser.firebaseUuid}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6">
              <button
                type="button"
                onClick={() => setViewingUserId(null)}
                className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153] hover:bg-[#F9FAFB]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Create User Modal */}
      {isCreatingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
          <div
            className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
            data-testid="create-user-modal"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#101828]">Crear Nuevo Usuario</h2>
              <button
                type="button"
                onClick={() => setIsCreatingUser(false)}
                aria-label="Cerrar modal"
                className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
              >
                ✕
              </button>
            </div>

            {formError ? <p className="mb-4 text-sm text-[#E7000B]">{formError}</p> : null}

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">
                  Nombre Completo
                </span>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej. Juan Pérez"
                  className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none focus:ring-2 focus:ring-[#00A63E]/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">
                  Correo Electrónico
                </span>
                <input
                  value={createForm.email}
                  onChange={(e) => setCreateForm((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="juan.perez@empresa.com"
                  className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none focus:ring-2 focus:ring-[#00A63E]/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Contraseña</span>
                <input
                  type="password"
                  value={createForm.password}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="Contraseña"
                  className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none focus:ring-2 focus:ring-[#00A63E]/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Rol</span>
                <select
                  value={createForm.roleId}
                  onChange={(e) =>
                    setCreateForm((prev) => ({ ...prev, roleId: Number(e.target.value) }))
                  }
                  className="h-9.75 w-full rounded-[10px] border border-[#D1D5DC] px-3 text-sm outline-none"
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Agricultor</option>
                  <option value={3}>Técnico Vendedor</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setIsCreatingUser(false)}
                className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateUser}
                disabled={createMutation.isPending}
                className="h-10.5 flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white hover:bg-[#008c35] disabled:opacity-60"
              >
                {createMutation.isPending ? 'Guardando...' : 'Guardar Usuario'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Edit User Modal */}
      {editingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
          <div
            className="w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6"
            data-testid="edit-user-modal"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#101828]">Editar Usuario</h2>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                aria-label="Cerrar modal"
                className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]"
              >
                ✕
              </button>
            </div>

            {formError ? <p className="mb-4 text-sm text-[#E7000B]">{formError}</p> : null}

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">
                  Nombre Completo
                </span>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="h-10.5 w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none focus:ring-2 focus:ring-[#00A63E]/15"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Rol</span>
                <select
                  value={editForm.roleId}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, roleId: Number(e.target.value) }))
                  }
                  disabled={editingUser.roleId === 2}
                  className="h-9.75 w-full rounded-[10px] border border-[#D1D5DC] px-3 text-sm outline-none disabled:opacity-60"
                >
                  <option value={1}>Administrador</option>
                  <option value={2}>Agricultor</option>
                  <option value={3}>Técnico Vendedor</option>
                </select>
                {editingUser.roleId === 2 ? (
                  <p className="mt-1 text-xs text-[#6A7282]">
                    El rol Agricultor no puede ser modificado.
                  </p>
                ) : null}
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#364153]">Usuario activo</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editForm.isActive}
                  onClick={() => setEditForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                    editForm.isActive ? 'bg-[#00A63E]' : 'bg-[#D1D5DC]'
                  }`}
                >
                  <span
                    className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      editForm.isActive ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEditUser}
                disabled={updateMutation.isPending}
                className="h-10.5 flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white hover:bg-[#008c35] disabled:opacity-60"
              >
                {updateMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Confirm Deactivate Modal */}
      {confirmTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6"
            data-testid="confirm-deactivate-modal"
          >
            <h2 className="text-[20px] font-bold leading-7 text-[#101828]">
              Desactivar Usuario
            </h2>
            <p className="mt-4 text-base text-[#4A5565]">
              ¿Está seguro que desea desactivar a{' '}
              <span className="font-medium text-[#101828]">{confirmTarget.name}</span>? El usuario
              no podrá acceder a la plataforma.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmTarget(null)}
                className="h-10.5 flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                disabled={deactivateMutation.isPending}
                className="h-10.5 flex-1 rounded-[10px] bg-[#E7000B] text-base font-medium text-white hover:bg-[#c40009] disabled:opacity-60"
              >
                {deactivateMutation.isPending ? 'Desactivando...' : 'Desactivar'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default GestionUsuariosPanel;

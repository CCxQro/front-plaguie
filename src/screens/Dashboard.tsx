import { useEffect, useMemo, useState } from 'react';

import { Sidebar, type SidebarItem } from '../components/Sidebar/Sidebar';
import { SearchIcon } from '../components/Icons/SearchIcon';
import { BellIcon } from '../components/Icons/BellIcon';
import { DataTableActionIcon } from '../components/DataTable/DataTableIcons';
import useAuthStore from '../services/Contexts/useAuthStore';
import { deactivateUserById, getUsers, registerUser, updateUserById } from '../services/admin/users';
import type { AdminUser, RegisterUserPayload } from '../types/AdminUser';

type UserRoleLabel = 'Administrador' | 'Agricultor' | 'Técnico Vendedor';

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'usuarios', label: 'Gestión de Usuarios', icon: 'usuarios' },
  { id: 'inventario', label: 'Inventario Global', icon: 'cubo' },
  { id: 'validacion', label: 'Validación de Registros', icon: 'validacion' },
  { id: 'dashboards', label: 'Dashboards', icon: 'dashboards' },
];

function roleIdToLabel(roleId: number): UserRoleLabel {
  if (roleId === 1) return 'Administrador';
  if (roleId === 2) return 'Agricultor';
  return 'Técnico Vendedor';
}

function roleLabelToRoleId(role: UserRoleLabel): number {
  if (role === 'Administrador') return 1;
  if (role === 'Agricultor') return 2;
  return 3;
}

function getInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return 'AP';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const [headerSearch, setHeaderSearch] = useState('');
  const [usersSearch, setUsersSearch] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isMutatingUserId, setIsMutatingUserId] = useState<number | null>(null);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [confirmTarget, setConfirmTarget] = useState<AdminUser | null>(null);
  const [confirmMode, setConfirmMode] = useState<'deactivate' | 'delete'>('deactivate');

  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    password: '',
    roleId: 3,
  });
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    roleId: 3,
    isActive: true,
  });

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) {
        setErrorMessage('Sesión inválida. Inicia sesión nuevamente.');
        setIsLoading(false);
        return;
      }

      try {
        setErrorMessage(null);
        const data = await getUsers(token);
        setUsers(data);
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'No se pudo cargar usuarios');
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, [token]);

  const filteredUsers = useMemo(() => {
    const query = usersSearch.trim().toLowerCase();
    if (!query) return users;
    return users.filter((item) => `${item.name} ${item.email}`.toLowerCase().includes(query));
  }, [usersSearch, users]);

  const handleRoleChange = async (target: AdminUser, roleLabel: UserRoleLabel) => {
    if (!token) return;
    const nextRoleId = roleLabelToRoleId(roleLabel);
    if (target.roleId === nextRoleId) return;

    setIsMutatingUserId(target.userId);
    try {
      const updated = await updateUserById(target.userId, { roleId: nextRoleId }, token);
      setUsers((prev) => prev.map((item) => (item.userId === updated.userId ? updated : item)));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo actualizar el rol');
    } finally {
      setIsMutatingUserId(null);
    }
  };

  const openEditModal = (target: AdminUser) => {
    setEditForm({
      name: target.name,
      email: target.email,
      roleId: target.roleId,
      isActive: target.isActive,
    });
    setEditingUser(target);
  };

  const handleCreateUser = async () => {
    if (!token) return;
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setErrorMessage('Nombre, correo y contraseña son obligatorios');
      return;
    }

    const payload: RegisterUserPayload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      roleId: createForm.roleId,
    };

    try {
      setErrorMessage(null);
      const created = await registerUser(payload, token);
      setUsers((prev) => [created, ...prev]);
      setIsCreatingUser(false);
      setCreateForm({
        name: '',
        email: '',
        password: '',
        roleId: 3,
      });
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo crear usuario');
    }
  };

  const handleSaveEditUser = async () => {
    if (!token || !editingUser) return;
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setErrorMessage('Nombre y correo son obligatorios');
      return;
    }

    setIsMutatingUserId(editingUser.userId);
    try {
      setErrorMessage(null);
      const updated = await updateUserById(
        editingUser.userId,
        {
          name: editForm.name.trim(),
          email: editForm.email.trim(),
          roleId: editForm.roleId,
          isActive: editForm.isActive,
        },
        token,
      );
      setUsers((prev) => prev.map((item) => (item.userId === updated.userId ? updated : item)));
      setEditingUser(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo guardar cambios');
    } finally {
      setIsMutatingUserId(null);
    }
  };

  const handleConfirmAction = async () => {
    if (!token || !confirmTarget) return;
    setIsMutatingUserId(confirmTarget.userId);
    try {
      setErrorMessage(null);
      await deactivateUserById(confirmTarget.userId, token);
      setUsers((prev) =>
        prev.map((item) =>
          item.userId === confirmTarget.userId ? { ...item, isActive: false } : item,
        ),
      );
      setConfirmTarget(null);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo completar la acción');
    } finally {
      setIsMutatingUserId(null);
    }
  };

  const handleToggleActive = async (target: AdminUser) => {
    if (!token) return;
    setIsMutatingUserId(target.userId);
    try {
      if (target.isActive) {
        await deactivateUserById(target.userId, token);
        setUsers((prev) => prev.map((item) => (item.userId === target.userId ? { ...item, isActive: false } : item)));
      } else {
        const updated = await updateUserById(target.userId, { isActive: true }, token);
        setUsers((prev) => prev.map((item) => (item.userId === updated.userId ? updated : item)));
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'No se pudo actualizar el estado');
    } finally {
      setIsMutatingUserId(null);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        variant="verde"
        appName="Plaguie"
        appSubtitle="Administrador"
        roleLabel="Administrador"
        items={SIDEBAR_ITEMS}
        activeItemId="usuarios"
        footerActionLabel="Cerrar Sesión"
        userName={user?.name ?? 'Admin Plaguie'}
        userDetail={user?.email ?? 'admin@plaguie.com'}
        userInitials={getInitials(user?.name ?? 'Admin Plaguie')}
      />

      <div className="flex flex-1 flex-col bg-[#F9FAFB]">
        <header className="border-b border-[#E5E7EB] bg-white px-8 py-4">
          <div className="flex items-center justify-between gap-4">
            <label className="relative block w-full max-w-[672px]">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input
                value={headerSearch}
                onChange={(event) => setHeaderSearch(event.target.value)}
                placeholder="Buscar en el sistema..."
                className="h-[42px] w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-10 pr-4 text-base text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
              />
            </label>
            <button type="button" className="relative grid h-10 w-10 place-content-center rounded-[10px] text-[#4A5565] hover:bg-[#F3F4F6]">
              <BellIcon />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FB2C36]" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-8 py-8">
          <section className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-[30px] font-bold leading-9 text-[#101828]">Gestión de Usuarios</h1>
              <p className="mt-2 text-base text-[#4A5565]">Administra y supervisa el rendimiento de tus usuarios.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreatingUser(true)}
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
                onChange={(event) => setUsersSearch(event.target.value)}
                placeholder="Buscar usuario por nombre o correo..."
                className="h-[50px] w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-12 pr-4 text-base text-[#0A0A0A] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/15"
              />
            </label>
          </section>

          <section className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_-1px_rgba(0,0,0,0.1)]">
            <div className="overflow-x-auto">
              {errorMessage ? <p className="px-6 pt-5 text-sm text-[#E7000B]">{errorMessage}</p> : null}
              <table className="w-full min-w-[1020px] border-collapse">
                <thead className="bg-[#F9FAFB]">
                  <tr className="border-b border-[#E5E7EB] text-left text-xs uppercase tracking-[0.6px] text-[#6A7282]">
                    <th className="px-6 py-4 font-medium">Nombre</th>
                    <th className="px-6 py-4 font-medium">Email</th>
                    <th className="px-6 py-4 font-medium">Rol/Permisos</th>
                    <th className="px-6 py-4 font-medium">Estado</th>
                    <th className="px-6 py-4 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((row) => (
                    <tr key={row.userId} className="border-b border-[#E5E7EB] last:border-b-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="grid h-10 w-10 place-content-center rounded-full bg-[linear-gradient(135deg,#05DF72_0%,#00A63E_100%)] text-base font-medium text-white">
                            {getInitials(row.name).charAt(0)}
                          </div>
                          <p className="text-base font-medium text-[#101828]">{row.name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-base text-[#4A5565]">{row.email}</td>
                      <td className="px-6 py-4">
                        <select
                          value={roleIdToLabel(row.roleId)}
                          onChange={(event) => {
                            void handleRoleChange(row, event.target.value as UserRoleLabel);
                          }}
                          disabled={isMutatingUserId === row.userId}
                          className="h-8 min-w-[137px] rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#334155] focus:outline-none"
                        >
                          <option>Administrador</option>
                          <option>Agricultor</option>
                          <option>Técnico Vendedor</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                            row.isActive ? 'bg-[#DCFCE7] text-[#016630]' : 'bg-[#F3F4F6] text-[#1E2939]'
                          }`}
                        >
                          <span className={`h-1.5 w-1.5 rounded-full ${row.isActive ? 'bg-[#00C950]' : 'bg-[#6A7282]'}`} />
                          {row.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(row)}
                            className="grid h-8 w-8 place-content-center rounded-[10px] text-[#155DFC] hover:bg-[#EFF6FF]"
                          >
                            <DataTableActionIcon icon="editar" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => { void handleToggleActive(row); }}
                            disabled={isMutatingUserId === row.userId}
                            className="grid h-8 w-8 place-content-center rounded-[10px] text-[#F54900] hover:bg-[#FFF7ED] disabled:opacity-40"
                          >
                            <DataTableActionIcon icon="ver" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmMode('delete');
                              setConfirmTarget(row);
                            }}
                            className="grid h-8 w-8 place-content-center rounded-[10px] text-[#E7000B] hover:bg-[#FEF2F2]"
                          >
                            <DataTableActionIcon icon="eliminar" className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isLoading ? <p className="px-6 py-4 text-sm text-[#6A7282]">Cargando usuarios...</p> : null}
            </div>
          </section>

          <p className="mt-6 text-sm text-[#6A7282]">Mostrando {filteredUsers.length} de {users.length} usuarios registrados</p>
        </main>
      </div>

      {isCreatingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
          <div className="w-full max-w-[448px] overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#101828]">Crear Nuevo Usuario</h2>
              <button type="button" onClick={() => setIsCreatingUser(false)} className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]">✕</button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Nombre Completo</span>
                <input value={createForm.name} onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))} placeholder="Ej. Juan Pérez" className="h-[42px] w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Correo Electrónico</span>
                <input value={createForm.email} onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))} placeholder="juan.perez@empresa.com" className="h-[42px] w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Contraseña</span>
                <input type="password" value={createForm.password} onChange={(event) => setCreateForm((prev) => ({ ...prev, password: event.target.value }))} placeholder="Contraseña" className="h-[42px] w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Rol</span>
                <select value={createForm.roleId} onChange={(event) => setCreateForm((prev) => ({ ...prev, roleId: Number(event.target.value) }))} className="h-[39px] w-full rounded-[10px] border border-[#D1D5DC] px-3 text-sm outline-none">
                  <option value={1}>Administrador</option>
                  <option value={2}>Agricultor</option>
                  <option value={3}>Técnico Vendedor</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setIsCreatingUser(false)} className="h-[42px] flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]">Cancelar</button>
              <button type="button" onClick={() => { void handleCreateUser(); }} className="h-[42px] flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white">Guardar Usuario</button>
            </div>
          </div>
        </div>
      ) : null}

      {editingUser ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4 py-8">
          <div className="w-full max-w-[448px] overflow-y-auto rounded-2xl bg-white p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#101828]">Editar Usuario</h2>
              <button type="button" onClick={() => setEditingUser(null)} className="grid h-9 w-9 place-content-center rounded-[10px] hover:bg-[#F3F4F6]">✕</button>
            </div>

            <div className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Nombre Completo</span>
                <input value={editForm.name} onChange={(event) => setEditForm((prev) => ({ ...prev, name: event.target.value }))} className="h-[42px] w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Correo Electrónico</span>
                <input value={editForm.email} onChange={(event) => setEditForm((prev) => ({ ...prev, email: event.target.value }))} className="h-[42px] w-full rounded-[10px] border border-[#D1D5DC] px-4 text-base outline-none" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-[#364153]">Rol</span>
                <select value={editForm.roleId} onChange={(event) => setEditForm((prev) => ({ ...prev, roleId: Number(event.target.value) }))} className="h-[39px] w-full rounded-[10px] border border-[#D1D5DC] px-3 text-sm outline-none">
                  <option value={1}>Administrador</option>
                  <option value={2}>Agricultor</option>
                  <option value={3}>Técnico Vendedor</option>
                </select>
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#364153]">Usuario activo</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={editForm.isActive}
                  onClick={() => setEditForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${editForm.isActive ? 'bg-[#00A63E]' : 'bg-[#D1D5DC]'}`}
                >
                  <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${editForm.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setEditingUser(null)} className="h-[42px] flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]">Cancelar</button>
              <button type="button" onClick={() => { void handleSaveEditUser(); }} className="h-[42px] flex-1 rounded-[10px] bg-[#00A63E] text-base font-medium text-white">Guardar Cambios</button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-[448px] rounded-2xl bg-white p-6">
            <h2 className="text-[20px] font-bold leading-7 text-[#101828]">Confirmar Acción</h2>
            <p className="mt-4 text-base text-[#4A5565]">
              {confirmMode === 'delete'
                ? `¿Está seguro que desea eliminar al usuario ${confirmTarget.name}?`
                : `¿Está seguro que desea desactivar al usuario ${confirmTarget.name}?`}
            </p>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setConfirmTarget(null)} className="h-[42px] flex-1 rounded-[10px] border border-[#D1D5DC] text-base font-medium text-[#364153]">Cancelar</button>
              <button type="button" onClick={() => { void handleConfirmAction(); }} className="h-[42px] flex-1 rounded-[10px] bg-[#E7000B] text-base font-medium text-white">Confirmar</button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;

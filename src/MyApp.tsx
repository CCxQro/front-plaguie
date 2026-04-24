import { useEffect, useMemo, useState } from 'react';

import { Sidebar, type SidebarItem } from './components/Sidebar/Sidebar';
import { mockUserService, type UpsertUserPayload, type UserEntityDTO } from './services/mockUserService';

type ModalMode = 'create' | 'edit';

type UserFormState = {
  name: string;
  email: string;
  roleId: number;
  zoneAssigned: string;
  isActive: boolean;
};

const ROLE_OPTIONS = [
  { id: 1, label: 'Administrador' },
  { id: 2, label: 'Supervisor' },
  { id: 3, label: 'Operador' },
] as const;

const ZONE_OPTIONS = ['Zona Norte', 'Zona Sur', 'Zona Centro', 'Zona Oeste', 'N/A'] as const;

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'usuarios', label: 'Gestion de Usuarios', icon: 'usuarios' },
  { id: 'inventarioGlobal', label: 'Inventario Global', icon: 'cubo' },
  { id: 'validacion', label: 'Validacion de Registros', icon: 'validacion' },
  { id: 'dashboards', label: 'Dashboards', icon: 'dashboards' },
];

const inputBase =
  'h-11 w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-10 pr-4 text-[15px] text-[#4A5565] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25';

const formInputBase =
  'h-11 w-full rounded-[10px] border border-[#D1D5DC] bg-white px-4 text-[15px] text-[#101828] placeholder:text-[#99A1AF] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25';

const EMPTY_FORM: UserFormState = {
  name: '',
  email: '',
  roleId: 3,
  zoneAssigned: 'N/A',
  isActive: true,
};

function roleLabel(roleId: number): string {
  return ROLE_OPTIONS.find((role) => role.id === roleId)?.label ?? 'Sin rol';
}

function buildUserPayload(form: UserFormState): UpsertUserPayload {
  return {
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    roleId: form.roleId,
    zoneAssigned: form.zoneAssigned,
    isActive: form.isActive,
  };
}

function userToForm(user: UserEntityDTO): UserFormState {
  return {
    name: user.name,
    email: user.email,
    roleId: user.roleId,
    zoneAssigned: user.zoneAssigned,
    isActive: user.isActive,
  };
}

function hasValidForm(form: UserFormState): boolean {
  if (!form.name.trim()) return false;
  if (!form.email.trim()) return false;

  return /^\S+@\S+\.\S+$/.test(form.email);
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M16.5 16.5L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
      <path d="M15 18H9M18 16V11C18 7.8 16.1 5.1 13.2 4.2V3.5C13.2 2.7 12.6 2 11.8 2S10.4 2.7 10.4 3.5V4.2C7.5 5.1 5.6 7.8 5.6 11V16L4 17.6V18H20V17.6L18 16Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M4 20L8.2 19.2L18.2 9.2L14.8 5.8L4.8 15.8L4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M13.8 6.8L17.2 10.2" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function BanIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.5 8.5L15.5 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8.8 12.1L11.2 14.5L15.6 10.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
      <path d="M5 7H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5.5C9 4.7 9.7 4 10.5 4H13.5C14.3 4 15 4.7 15 5.5V7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 7L7.8 18.3C7.9 19.2 8.6 20 9.6 20H14.4C15.4 20 16.1 19.2 16.2 18.3L17 7" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10 11V16M14 11V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MyApp() {
  const [users, setUsers] = useState<UserEntityDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeItemId, setActiveItemId] = useState('usuarios');
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>('create');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formState, setFormState] = useState<UserFormState>(EMPTY_FORM);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const fetchedUsers = await mockUserService.fetchAllUsers();
        setUsers(fetchedUsers);
      } finally {
        setLoading(false);
      }
    };

    void loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = `${globalSearchTerm} ${userSearchTerm}`.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        roleLabel(user.roleId).toLowerCase().includes(query) ||
        user.zoneAssigned.toLowerCase().includes(query)
      );
    });
  }, [users, globalSearchTerm, userSearchTerm]);

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUserId(null);
    setFormState(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (user: UserEntityDTO) => {
    setModalMode('edit');
    setSelectedUserId(user.userId);
    setFormState(userToForm(user));
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedUserId(null);
  };

  const handleCreateOrUpdateUser = async () => {
    if (!hasValidForm(formState)) {
      alert('Completa los campos obligatorios con datos validos.');
      return;
    }

    const payload = buildUserPayload(formState);

    if (modalMode === 'create') {
      const createdUser = await mockUserService.createUser(payload);
      setUsers((current) => [...current, createdUser]);
      alert('Usuario creado - API no conectada aun (simulacion localStorage).');
      closeModal();
      return;
    }

    if (!selectedUserId) {
      return;
    }

    const updatedUser = await mockUserService.updateUser(selectedUserId, payload);
    setUsers((current) => current.map((user) => (user.userId === selectedUserId ? updatedUser : user)));
    alert('Usuario actualizado - API no conectada aun (simulacion localStorage).');
    closeModal();
  };

  const handleRoleChange = async (user: UserEntityDTO, newRoleId: number) => {
    const updatedUser = await mockUserService.updateUser(user.userId, {
      name: user.name,
      email: user.email,
      roleId: newRoleId,
      zoneAssigned: user.zoneAssigned,
      isActive: user.isActive,
    });

    setUsers((current) => current.map((item) => (item.userId === user.userId ? updatedUser : item)));
    alert('Rol actualizado - API no conectada aun (simulacion localStorage).');
  };

  const handleToggleStatus = async (user: UserEntityDTO) => {
    const nextStatus = !user.isActive;
    const updatedUser = await mockUserService.updateUser(user.userId, {
      name: user.name,
      email: user.email,
      roleId: user.roleId,
      zoneAssigned: user.zoneAssigned,
      isActive: nextStatus,
    });

    setUsers((current) => current.map((item) => (item.userId === user.userId ? updatedUser : item)));
    alert(`Usuario ${nextStatus ? 'activado' : 'desactivado'} - API no conectada aun (simulacion localStorage).`);
  };

  const handleDelete = async (user: UserEntityDTO) => {
    const confirmed = window.confirm(`Eliminar a ${user.name}?`);

    if (!confirmed) {
      return;
    }

    await mockUserService.deleteUser(user.userId);
    setUsers((current) => current.filter((item) => item.userId !== user.userId));
    alert('Usuario eliminado - API no conectada aun (simulacion localStorage).');
  };

  const handleSidebarItemClick = (itemId: string) => {
    setActiveItemId(itemId);

    if (itemId !== 'usuarios') {
      alert('Seccion en construccion. API y rutas reales aun no conectadas.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="flex min-h-screen flex-col bg-[#F9FAFB] md:flex-row">
        <Sidebar
          variant="verde"
          appName="Plaguie"
          appSubtitle="Administrador"
          roleLabel="Administrador"
          items={SIDEBAR_ITEMS}
          activeItemId={activeItemId}
          footerActionLabel="Cerrar Sesion"
          userName="Admin Plaguie"
          userDetail="admin@plaguie.com"
          userInitials="AP"
          className="h-auto min-h-screen"
          onItemClick={handleSidebarItemClick}
          onFooterActionClick={() => alert('Sesion cerrada (simulada) - API no conectada aun.')}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#E5E7EB] bg-white px-4 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                  <SearchIcon />
                </span>
                <input
                  className={inputBase}
                  placeholder="Buscar en el sistema..."
                  value={globalSearchTerm}
                  onChange={(event) => setGlobalSearchTerm(event.target.value)}
                />
              </div>

              <button
                type="button"
                className="relative flex h-10 w-10 items-center justify-center rounded-[10px] text-[#4A5565] hover:bg-[#F3F4F6]"
                onClick={() => alert('Notificaciones cargadas (simuladas) - API no conectada aun.')}
              >
                <BellIcon />
                <span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-[#FB2C36]" />
              </button>
            </div>
          </header>

          <section className="px-4 py-8 md:px-8">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-[0.395px] text-[#101828]">Gestion de Usuarios</h1>
                <p className="mt-2 text-base text-[#4A5565]">Administra y supervisa el rendimiento de tus usuarios</p>
              </div>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-[10px] bg-[#00A63E] px-6 text-base font-medium text-white shadow-sm hover:bg-[#019437]"
                onClick={openCreateModal}
              >
                <span className="mr-2 text-lg">⊕</span>
                Crear Usuario
              </button>
            </div>

            <div className="relative mb-5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input
                className="h-[50px] w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-12 pr-4 text-[15px] text-[#4A5565] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25"
                placeholder="Buscar usuario por nombre o correo..."
                value={userSearchTerm}
                onChange={(event) => setUserSearchTerm(event.target.value)}
              />
            </div>

            <div className="overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full border-collapse">
                  <thead className="bg-[#F9FAFB]">
                    <tr className="border-b border-[#E5E7EB] text-left">
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.6px] text-[#6A7282]">Nombre</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.6px] text-[#6A7282]">Email</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.6px] text-[#6A7282]">Zona Asignada</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.6px] text-[#6A7282]">Rol/Permisos</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.6px] text-[#6A7282]">Estado</th>
                      <th className="px-6 py-4 text-xs font-medium uppercase tracking-[0.6px] text-[#6A7282]">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#6A7282]">
                          Cargando usuarios...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-sm text-[#6A7282]">
                          No hay usuarios para los filtros actuales.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => {
                      const initials = user.name.charAt(0).toUpperCase();
                      const active = user.isActive;
                      const showActivate = !active;

                      return (
                        <tr key={user.userId} className="border-b border-[#E5E7EB] last:border-b-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#05DF72] to-[#00A63E] text-base font-medium text-white">
                                {initials}
                              </div>
                              <span className="text-base font-medium text-[#101828]">{user.name}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4 text-base text-[#4A5565]">{user.email}</td>

                          <td className="px-6 py-4">
                            {user.zoneAssigned === 'N/A' ? (
                              <span className="text-sm text-[#99A1AF]">N/A</span>
                            ) : (
                              <span className="inline-flex rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#193CB8]">
                                {user.zoneAssigned}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <select
                              value={user.roleId}
                              onChange={(event) => void handleRoleChange(user, Number(event.target.value))}
                              className="h-8 w-[137px] rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#4A5565] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25"
                            >
                              {ROLE_OPTIONS.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
                                active
                                  ? 'bg-[#DCFCE7] text-[#016630]'
                                  : 'bg-[#F3F4F6] text-[#1E2939]'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  active ? 'bg-[#00C950]' : 'bg-[#6A7282]'
                                }`}
                              />
                              {active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#155DFC] hover:bg-[#EFF6FF]"
                                aria-label="Editar"
                                onClick={() => openEditModal(user)}
                              >
                                <PencilIcon />
                              </button>

                              <button
                                type="button"
                                className={`flex h-8 w-8 items-center justify-center rounded-[10px] ${
                                  showActivate
                                    ? 'text-[#00A63E] hover:bg-[#ECFDF3]'
                                    : 'text-[#F54900] hover:bg-[#FFF2EB]'
                                }`}
                                aria-label={showActivate ? 'Activar' : 'Desactivar'}
                                onClick={() => void handleToggleStatus(user)}
                              >
                                {showActivate ? <CheckCircleIcon /> : <BanIcon />}
                              </button>

                              <button
                                type="button"
                                className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#E7000B] hover:bg-[#FEF2F2]"
                                aria-label="Eliminar"
                                onClick={() => void handleDelete(user)}
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-5 text-sm text-[#6A7282]">
              Mostrando {filteredUsers.length} de {users.length} usuarios registrados
            </p>
          </section>
        </main>
      </div>

      {modalOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-[14px] bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#101828]">
                  {modalMode === 'create' ? 'Crear Usuario' : 'Editar Usuario'}
                </h2>
                <p className="mt-1 text-sm text-[#4A5565]">
                  {modalMode === 'create'
                    ? 'Completa los datos para crear un nuevo usuario.'
                    : 'Actualiza los datos y guarda los cambios.'}
                </p>
              </div>

              <button
                type="button"
                className="rounded-[10px] p-2 text-[#6A7282] hover:bg-[#F3F4F6]"
                onClick={closeModal}
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#101828]">Nombre</label>
                <input
                  className={formInputBase}
                  placeholder="Nombre completo"
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-[#101828]">Email</label>
                <input
                  className={formInputBase}
                  placeholder="correo@empresa.com"
                  value={formState.email}
                  onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#101828]">Rol / Permisos</label>
                  <select
                    className={formInputBase}
                    value={formState.roleId}
                    onChange={(event) => setFormState((current) => ({ ...current, roleId: Number(event.target.value) }))}
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[#101828]">Zona Asignada</label>
                  <select
                    className={formInputBase}
                    value={formState.zoneAssigned}
                    onChange={(event) => setFormState((current) => ({ ...current, zoneAssigned: event.target.value }))}
                  >
                    {ZONE_OPTIONS.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-[10px] border border-[#D1D5DC] p-3 text-sm text-[#4A5565]">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#00A63E]"
                  checked={formState.isActive}
                  onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
                />
                Usuario activo
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="h-11 rounded-[10px] border border-[#D1D5DC] px-4 text-sm font-medium text-[#4A5565] hover:bg-[#F9FAFB]"
                onClick={closeModal}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="h-11 rounded-[10px] bg-[#00A63E] px-4 text-sm font-medium text-white hover:bg-[#019437] disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => void handleCreateOrUpdateUser()}
                disabled={!hasValidForm(formState)}
              >
                {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default MyApp;
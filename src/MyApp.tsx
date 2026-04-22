type UserStatus = 'Activo' | 'Inactivo';

type UserRow = {
  id: number;
  name: string;
  email: string;
  zone: string;
  status: UserStatus;
};

const users: UserRow[] = [
  { id: 1, name: 'Carlos Ruiz', email: 'carlos.ruiz@plaguie.com', zone: 'Zona Norte', status: 'Activo' },
  { id: 2, name: 'Elena Gomez', email: 'elena.gomez@plaguie.com', zone: 'Zona Sur', status: 'Activo' },
  { id: 3, name: 'Mario Sosa', email: 'mario.sosa@plaguie.com', zone: 'Zona Centro', status: 'Inactivo' },
  { id: 4, name: 'Lucia Mendez', email: 'lucia.mendez@plaguie.com', zone: 'Zona Oeste', status: 'Activo' },
  { id: 5, name: 'Juan Perez', email: 'juan.perez@agro.com', zone: 'N/A', status: 'Activo' },
  { id: 6, name: 'Ana Torres', email: 'ana.torres@agro.com', zone: 'N/A', status: 'Activo' },
];

const navItems = [
  'Dashboard',
  'Gestion de Usuarios',
  'Inventario Global',
  'Validacion de Registros',
  'Dashboards',
];

const inputBase =
  'h-11 w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-10 pr-4 text-[15px] text-[#4A5565] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25';

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
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <div className="h-7 w-full bg-[#18181B] px-4 text-xs leading-7 text-white">Admin</div>

      <div className="flex min-h-[calc(100vh-28px)] flex-col bg-[#F9FAFB] md:flex-row">
        <aside className="w-full bg-gradient-to-b from-[#008236] to-[#016630] text-white md:w-64">
          <div className="border-b border-[#00A63E] px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/20">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white text-[10px]">✓</span>
              </div>
              <div>
                <p className="text-[18px] font-bold leading-7">Plaguie</p>
                <p className="text-xs text-[#B9F8CF]">Administrador</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-wrap gap-2 px-4 py-6 md:flex-col md:gap-1">
            {navItems.map((item) => {
              const active = item === 'Gestion de Usuarios';

              return (
                <button
                  key={item}
                  type="button"
                  className={`flex h-11 items-center rounded-[10px] px-4 text-left text-sm font-medium transition ${
                    active ? 'bg-white/20 text-white' : 'text-[#DCFCE7] hover:bg-white/10'
                  }`}
                >
                  <span className="mr-3 text-base">◻</span>
                  {item}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-[#00A63E] px-4 py-4">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00A63E] text-sm font-semibold">
                AP
              </div>
              <div>
                <p className="text-sm font-medium">Admin Plaguie</p>
                <p className="text-xs text-[#B9F8CF]">admin@plaguie.com</p>
              </div>
            </div>
            <button type="button" className="flex h-9 w-full items-center rounded-[10px] px-4 text-sm font-medium text-[#DCFCE7] hover:bg-white/10">
              <span className="mr-2">↪</span>
              Cerrar Sesion
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#E5E7EB] bg-white px-4 py-4 md:px-8">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                  <SearchIcon />
                </span>
                <input className={inputBase} placeholder="Buscar en el sistema..." />
              </div>

              <button type="button" className="relative flex h-10 w-10 items-center justify-center rounded-[10px] text-[#4A5565] hover:bg-[#F3F4F6]">
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
              >
                <span className="mr-2 text-lg">⊕</span>
                Crear Usuario
              </button>
            </div>

            <div className="relative mb-5">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]">
                <SearchIcon />
              </span>
              <input className="h-[50px] w-full rounded-[10px] border border-[#D1D5DC] bg-white pl-12 pr-4 text-[15px] text-[#4A5565] placeholder:text-[rgba(10,10,10,0.5)] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25" placeholder="Buscar usuario por nombre o correo..." />
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
                    {users.map((user) => {
                      const initials = user.name.charAt(0).toUpperCase();
                      const active = user.status === 'Activo';
                      const showActivate = !active;

                      return (
                        <tr key={user.id} className="border-b border-[#E5E7EB] last:border-b-0">
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
                            {user.zone === 'N/A' ? (
                              <span className="text-sm text-[#99A1AF]">N/A</span>
                            ) : (
                              <span className="inline-flex rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#193CB8]">
                                {user.zone}
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4">
                            <select
                              defaultValue=""
                              className="h-8 w-[137px] rounded-[10px] border border-[#D1D5DC] bg-white px-3 text-sm text-[#4A5565] focus:outline-none focus:ring-2 focus:ring-[#00A63E]/25"
                            >
                              <option value="" disabled />
                              <option>Administrador</option>
                              <option>Supervisor</option>
                              <option>Operador</option>
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
                              {user.status}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#155DFC] hover:bg-[#EFF6FF]" aria-label="Editar">
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
                              >
                                {showActivate ? <CheckCircleIcon /> : <BanIcon />}
                              </button>

                              <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] text-[#E7000B] hover:bg-[#FEF2F2]" aria-label="Eliminar">
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <p className="mt-5 text-sm text-[#6A7282]">Mostrando 6 de 6 usuarios registrados</p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default MyApp;
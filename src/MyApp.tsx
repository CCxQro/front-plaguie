type UserRow = {
  id: number
  name: string
  email: string
  zone: string
  role: string
  status: 'Activo' | 'Inactivo'
}

const users: UserRow[] = [
  {
    id: 1,
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@plaguie.com',
    zone: 'Zona Norte',
    role: 'Supervisor',
    status: 'Activo',
  },
  {
    id: 2,
    name: 'Elena Gomez',
    email: 'elena.gomez@plaguie.com',
    zone: 'Zona Sur',
    role: 'Vendedor',
    status: 'Activo',
  },
  {
    id: 3,
    name: 'Mario Sosa',
    email: 'mario.sosa@plaguie.com',
    zone: 'Zona Centro',
    role: 'Analista',
    status: 'Inactivo',
  },
  {
    id: 4,
    name: 'Lucia Mendez',
    email: 'lucia.mendez@plaguie.com',
    zone: 'Zona Oeste',
    role: 'Vendedor',
    status: 'Activo',
  },
  {
    id: 5,
    name: 'Juan Perez',
    email: 'juan.perez@agro.com',
    zone: 'N/A',
    role: 'Invitado',
    status: 'Activo',
  },
  {
    id: 6,
    name: 'Ana Torres',
    email: 'ana.torres@agro.com',
    zone: 'N/A',
    role: 'Invitado',
    status: 'Activo',
  },
]

const roleOptions = ['Administrador', 'Supervisor', 'Analista', 'Vendedor', 'Invitado']

function Sidebar() {
  return (
    <aside className="flex h-full w-full flex-col bg-gradient-to-b from-[#008236] to-[#016630] text-white md:w-64">
      <div className="border-b border-[#00A63E] px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-semibold">P</div>
          <div>
            <p className="text-lg font-bold leading-7">Plaguie</p>
            <p className="text-xs text-[#B9F8CF]">Administrador</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 text-sm font-medium">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#DCFCE7] transition hover:bg-white/10">
          <span className="text-base">▦</span>
          Dashboard
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl bg-white/20 px-4 py-3 text-white">
          <span className="text-base">👥</span>
          Gestion de Usuarios
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#DCFCE7] transition hover:bg-white/10">
          <span className="text-base">📦</span>
          Inventario Global
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#DCFCE7] transition hover:bg-white/10">
          <span className="text-base">🛡</span>
          Validacion de Registros
        </button>
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[#DCFCE7] transition hover:bg-white/10">
          <span className="text-base">📊</span>
          Dashboards
        </button>
      </nav>

      <div className="space-y-3 border-t border-[#00A63E] px-4 py-4">
        <div className="flex items-center gap-3 rounded-xl px-2 py-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00A63E] text-sm font-semibold">AP</div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Admin Plaguie</p>
            <p className="truncate text-xs text-[#B9F8CF]">admin@plaguie.com</p>
          </div>
        </div>
        <button className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-[#DCFCE7] hover:bg-white/10">
          <span>⇦</span>
          Cerrar Sesion
        </button>
      </div>
    </aside>
  )
}

function StatusBadge({ status }: { status: UserRow['status'] }) {
  const active = status === 'Activo'

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        active ? 'bg-[#DCFCE7] text-[#016630]' : 'bg-[#F3F4F6] text-[#1E2939]'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${active ? 'bg-[#00C950]' : 'bg-[#6A7282]'}`} />
      {status}
    </span>
  )
}

function ZoneBadge({ zone }: { zone: string }) {
  if (zone === 'N/A') {
    return <span className="text-sm text-[#99A1AF]">N/A</span>
  }

  return (
    <span className="inline-flex rounded-full bg-[#DBEAFE] px-3 py-1 text-xs font-medium text-[#193CB8]">
      {zone}
    </span>
  )
}

function MyApp() {
  return (
    <div className="min-h-screen bg-white font-[Inter,sans-serif] text-[#101828]">
      <div className="mx-auto flex min-h-screen w-full max-w-[1431px] flex-col bg-[#F9FAFB] md:flex-row">
        <div className="md:h-auto md:w-64">
          <Sidebar />
        </div>

        <main className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-[#E5E7EB] bg-white px-4 py-4 md:px-8">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#99A1AF]">⌕</span>
                <input
                  type="text"
                  placeholder="Buscar en el sistema..."
                  className="h-10 w-full rounded-xl border border-[#D1D5DC] bg-white pl-10 pr-4 text-sm text-[#0A0A0A] placeholder:text-black/50 focus:border-[#00A63E] focus:outline-none"
                />
              </div>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-xl text-lg text-[#4A5565] hover:bg-[#F3F4F6]">
                🔔
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#FB2C36]" />
              </button>
            </div>
          </header>

          <section className="flex-1 px-4 py-6 md:px-8 md:py-8">
            <div className="space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Gestion de Usuarios</h1>
                  <p className="mt-1 text-base text-[#4A5565]">
                    Administra y supervisa el rendimiento de tus usuarios.
                  </p>
                </div>
                <button className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#00A63E] px-6 text-sm font-semibold text-white transition hover:bg-[#008236]">
                  <span className="text-base">＋</span>
                  Crear Usuario
                </button>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#99A1AF]">⌕</span>
                <input
                  type="text"
                  placeholder="Buscar usuario por nombre o correo..."
                  className="h-12 w-full rounded-xl border border-[#D1D5DC] bg-white pl-12 pr-4 text-sm placeholder:text-black/50 focus:border-[#00A63E] focus:outline-none"
                />
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-[980px] divide-y divide-[#E5E7EB]">
                    <thead className="bg-[#F9FAFB]">
                      <tr className="text-left text-xs font-medium uppercase tracking-wider text-[#6A7282]">
                        <th className="px-6 py-4">Nombre</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Zona Asignada</th>
                        <th className="px-6 py-4">Rol/Permisos</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E7EB]">
                      {users.map((user) => (
                        <tr key={user.id} className="text-sm">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#05DF72] to-[#00A63E] text-sm font-semibold text-white">
                                {user.name.slice(0, 1)}
                              </div>
                              <span className="font-medium text-[#101828]">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-[#4A5565]">{user.email}</td>
                          <td className="px-6 py-4">
                            <ZoneBadge zone={user.zone} />
                          </td>
                          <td className="px-6 py-4">
                            <select
                              defaultValue={user.role}
                              className="h-8 rounded-xl border border-[#D1D5DC] bg-white px-3 text-xs text-[#101828] focus:border-[#00A63E] focus:outline-none"
                            >
                              {roleOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#155DFC] hover:bg-[#EFF6FF]"
                                aria-label={`Ver ${user.name}`}
                              >
                                👁
                              </button>
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#F54900] hover:bg-[#FFF7ED]"
                                aria-label={`Editar ${user.name}`}
                              >
                                ✎
                              </button>
                              <button
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#E7000B] hover:bg-[#FEF2F2]"
                                aria-label={`Eliminar ${user.name}`}
                              >
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <p className="text-sm text-[#6A7282]">Mostrando 6 de 6 usuarios registrados</p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default MyApp
export interface UserEntityDTO {
  userId: number;
  firebaseUuid: string;
  name: string;
  email: string;
  roleId: number;
  isActive: boolean;
  zoneAssigned: string;
}

export interface UpsertUserPayload {
  name: string;
  email: string;
  roleId: number;
  zoneAssigned: string;
  isActive: boolean;
}

const STORAGE_KEY = 'plaguie-admin-users';

const INITIAL_USERS: UserEntityDTO[] = [
  {
    userId: 1,
    firebaseUuid: '5dcf4fa9-7d57-4606-8898-b6f0604e7f58',
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@plaguie.com',
    roleId: 1,
    isActive: true,
    zoneAssigned: 'Zona Norte',
  },
  {
    userId: 2,
    firebaseUuid: 'f53fc452-dd77-44bc-90d5-6c9f5beea0bb',
    name: 'Elena Gomez',
    email: 'elena.gomez@plaguie.com',
    roleId: 2,
    isActive: true,
    zoneAssigned: 'Zona Sur',
  },
  {
    userId: 3,
    firebaseUuid: 'fe8fd1e2-25bc-4d57-a9da-00ac6ef636d4',
    name: 'Mario Sosa',
    email: 'mario.sosa@plaguie.com',
    roleId: 3,
    isActive: false,
    zoneAssigned: 'Zona Centro',
  },
  {
    userId: 4,
    firebaseUuid: 'bc95f2ab-0052-4162-b6fc-81a3e95c0280',
    name: 'Lucia Mendez',
    email: 'lucia.mendez@plaguie.com',
    roleId: 2,
    isActive: true,
    zoneAssigned: 'Zona Oeste',
  },
  {
    userId: 5,
    firebaseUuid: '4cdd34ce-111d-4061-acd7-7ce32855753b',
    name: 'Juan Perez',
    email: 'juan.perez@agro.com',
    roleId: 3,
    isActive: true,
    zoneAssigned: 'N/A',
  },
  {
    userId: 6,
    firebaseUuid: '3d2ef812-1a76-40e3-8948-27e64326b744',
    name: 'Ana Torres',
    email: 'ana.torres@agro.com',
    roleId: 3,
    isActive: true,
    zoneAssigned: 'N/A',
  },
];

function readFromStorage(): UserEntityDTO[] {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return [...INITIAL_USERS];
  }

  try {
    const parsed = JSON.parse(raw) as UserEntityDTO[];

    if (!Array.isArray(parsed)) {
      throw new Error('Invalid users payload');
    }

    return parsed;
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_USERS));
    return [...INITIAL_USERS];
  }
}

function writeToStorage(users: UserEntityDTO[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function withLatency<T>(data: T, latencyMs = 200): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), latencyMs);
  });
}

function generateFirebaseUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
}

export const mockUserService = {
  async fetchAllUsers(): Promise<UserEntityDTO[]> {
    const users = readFromStorage();
    return withLatency(users);
  },

  async createUser(payload: UpsertUserPayload): Promise<UserEntityDTO> {
    const users = readFromStorage();
    const nextId = users.length > 0 ? Math.max(...users.map((user) => user.userId)) + 1 : 1;

    const newUser: UserEntityDTO = {
      userId: nextId,
      firebaseUuid: generateFirebaseUuid(),
      name: payload.name,
      email: payload.email,
      roleId: payload.roleId,
      isActive: payload.isActive,
      zoneAssigned: payload.zoneAssigned,
    };

    const updated = [...users, newUser];
    writeToStorage(updated);
    return withLatency(newUser);
  },

  async updateUser(userId: number, payload: UpsertUserPayload): Promise<UserEntityDTO> {
    const users = readFromStorage();
    const targetUser = users.find((user) => user.userId === userId);

    if (!targetUser) {
      throw new Error(`User with id ${userId} not found`);
    }

    const updatedUser: UserEntityDTO = {
      ...targetUser,
      name: payload.name,
      email: payload.email,
      roleId: payload.roleId,
      isActive: payload.isActive,
      zoneAssigned: payload.zoneAssigned,
    };

    const updatedUsers = users.map((user) => (user.userId === userId ? updatedUser : user));
    writeToStorage(updatedUsers);

    return withLatency(updatedUser);
  },

  async deleteUser(userId: number): Promise<void> {
    const users = readFromStorage();
    const updatedUsers = users.filter((user) => user.userId !== userId);
    writeToStorage(updatedUsers);

    return withLatency(undefined);
  },
};

export interface AdminUser {
  userId: number;
  firebaseUuid: string;
  name: string;
  email: string;
  roleId: number;
  isActive: boolean;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: number;
}

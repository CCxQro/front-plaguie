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

export interface UserListParams {
  page: number;
  size: number;
  name?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UsersPage {
  content: AdminUser[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

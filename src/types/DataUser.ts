export interface DataUser {
  userId: number;
  firebaseUuid: string;
  name: string;
  email: string;
  roleId: number;
  isActive: boolean;
}

export interface UserLocation {
  locationId: number;
  latitude: number;
  longitude: number;
  stateId: number;
  stateName: string;
  municipalityId: number;
  municipalityName: string;
  localityId: number;
  localityName: string;
  propertyId: number;
  propertyName: string;
}

/** Returned by GET /api/users/:id — extends DataUser with an optional location.
 *  Location lives on the user (Usuario.id_ubicacion); by convention only non-admin
 *  users have one set, so admins typically come back without a `location` field. */
export interface DataUserDetail extends DataUser {
  location?: UserLocation;
}

/** Farmer account awaiting administrator approval (status = Revision).
 *  Shape matches the backend `Farmer` JSON from GET /api/users/farmers/pending. */
export interface PendingFarmer {
  farmerId: number;
  active: boolean;
  statusId: number | null;
  statusName: string | null;
  user: {
    userId: number;
    name: string;
    email: string;
    roleId: number;
  } | null;
}

export interface UpdateLocationPayload {
  stateName?: string;
  municipalityName?: string;
  localityName?: string;
  propertyName?: string;
  latitude?: number;
  longitude?: number;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  roleId?: number;
  isActive?: boolean;
  location?: UpdateLocationPayload;
}

export interface RegisterLocationPayload {
  stateName: string;
  municipalityName: string;
  localityName: string;
  propertyName: string;
  latitude: number;
  longitude: number;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  roleId: number;
  location?: RegisterLocationPayload;
}

export interface UserListParams {
  page: number;
  size: number;
  name?: string;
  roleId?: number;
  isActive?: boolean;
}

export interface UsersPage {
  content: DataUser[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

type RoleLabel = 'Administrador' | 'Agricultor' | 'Técnico Vendedor';

export function roleIdToLabel(roleId: number): RoleLabel {
  if (roleId === 1) return 'Administrador';
  if (roleId === 2) return 'Agricultor';
  return 'Técnico Vendedor';
}

export function roleBadgeClasses(roleId: number): string {
  if (roleId === 1) return 'bg-[#EFF6FF] text-[#1D4ED8]';
  if (roleId === 2) return 'bg-[#DCFCE7] text-[#016630]';
  return 'bg-[#F3E8FF] text-[#6D28D9]';
}

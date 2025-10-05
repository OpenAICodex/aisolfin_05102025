export type UserRole = 'admin' | 'user';

/**
 * Normalises a role string from the database or session cookies into a
 * supported application role. Unknown values fall back to `user` so that
 * access checks default to the least privileged option.
 */
export const normalizeRole = (role: string | null | undefined): UserRole => {
  if (typeof role !== 'string') {
    return 'user';
  }
  const normalized = role.trim().toLowerCase();
  return normalized === 'admin' ? 'admin' : 'user';
};

/**
 * Convenience helper to check whether a role grants admin privileges.
 */
export const isAdminRole = (role: string | null | undefined): boolean => normalizeRole(role) === 'admin';

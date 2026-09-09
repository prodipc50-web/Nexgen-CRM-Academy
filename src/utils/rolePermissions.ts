import { UserRole } from '../types';

export const ROLE_VIEW_PERMISSIONS: Record<string, UserRole[]> = {
  dashboard: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'TRAINER'],
  crm: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  students: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  courses: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  batches: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  schedule: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  assignments: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER', 'COUNSELOR'],
  attendance: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER'],
  exams: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'TRAINER'],
  certificates: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  payments: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  due: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR'],
  expenses: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  'financial-reports': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS'],
  placements: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'TRAINER'],
  seminars: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  marketing: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  website_cms: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR'],
  'inventory-staff': ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  reports: ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR'],
  'ai-assistant': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'COUNSELOR', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'TRAINER'],
  settings: ['SUPER_ADMIN', 'ADMIN', 'MANAGER'],
  'recycle-bin': ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'ACCOUNTS_STAFF', 'ACCOUNTS', 'COUNSELOR', 'TRAINER']
};

export function isViewAllowedForRole(viewId: string, role: UserRole): boolean {
  // Normalize role aliases
  const effectiveRole = role === 'ADMIN' ? 'SUPER_ADMIN' : role === 'ACCOUNTS' ? 'ACCOUNTS_STAFF' : role;
  
  // Super Admin has universal access
  if (effectiveRole === 'SUPER_ADMIN' || effectiveRole === 'MANAGER') {
    return true;
  }

  const allowedRoles = ROLE_VIEW_PERMISSIONS[viewId] || [];
  return allowedRoles.includes(role) || allowedRoles.includes(effectiveRole as UserRole);
}

export function canPerformAction(
  action: 'DELETE_PAYMENT' | 'RESTORE_BACKUP' | 'DELETE_STUDENT' | 'EDIT_SETTINGS' | 'VIEW_FINANCE' | 'ISSUE_CERTIFICATE',
  role: UserRole
): boolean {
  const effectiveRole = role === 'ADMIN' ? 'SUPER_ADMIN' : role === 'ACCOUNTS' ? 'ACCOUNTS_STAFF' : role;
  
  if (effectiveRole === 'SUPER_ADMIN' || effectiveRole === 'MANAGER') {
    return true;
  }

  switch (action) {
    case 'RESTORE_BACKUP':
    case 'EDIT_SETTINGS':
      return false; // Only Super Admin & Manager

    case 'DELETE_PAYMENT':
    case 'DELETE_STUDENT':
      return false; // Sensitive deletions reserved for Admin/Manager

    case 'VIEW_FINANCE':
      return effectiveRole === 'ACCOUNTS_STAFF';

    case 'ISSUE_CERTIFICATE':
      return effectiveRole === 'COUNSELOR';

    default:
      return false;
  }
}

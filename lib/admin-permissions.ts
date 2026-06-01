export type AdminRole = 'super_admin' | 'producer_admin' | 'content_admin' | 'operations_admin'

type Permission =
  | 'all'
  | 'users.view'
  | 'users.create'
  | 'users.delete'
  | 'users.reset_password'
  | 'users.assign_role'
  | 'payments.view'
  | 'bookings.view'
  | 'bookings.edit'
  | 'hours.manage'
  | 'subscriptions.view'
  | 'subscriptions.manage'
  | 'reports.full'
  | 'reports.basic'
  | 'soundlab.view'
  | 'soundlab.upload'
  | 'soundlab.revisions'
  | 'soundlab.notes'
  | 'soundlab.credits'
  | 'content.view'
  | 'content.upload'
  | 'content.calendar'
  | 'content.approve'
  | 'content.deliver'
  | 'assignments.manage'
  | 'audit.view'
  | 'settings.platform'
  | 'admins.create'

const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  super_admin: ['all'],
  producer_admin: [
    'soundlab.view',
    'soundlab.upload',
    'soundlab.revisions',
    'soundlab.notes',
    'soundlab.credits',
  ],
  content_admin: [
    'content.view',
    'content.upload',
    'content.calendar',
    'content.approve',
    'content.deliver',
  ],
  operations_admin: [
    'users.view',
    'users.reset_password',
    'bookings.view',
    'bookings.edit',
    'hours.manage',
    'subscriptions.view',
    'reports.basic',
  ],
}

export function can(adminRole: AdminRole | null | undefined, action: Permission): boolean {
  if (!adminRole) return false
  const perms = ROLE_PERMISSIONS[adminRole] ?? []
  return perms.includes('all') || perms.includes(action)
}

export function getAdminHome(adminRole: AdminRole | null | undefined): string {
  switch (adminRole) {
    case 'super_admin':    return '/admin'
    case 'producer_admin': return '/admin/soundlab'
    case 'content_admin':  return '/admin/content'
    case 'operations_admin': return '/admin/operations'
    default: return '/dashboard'
  }
}

export function getAdminRoleLabel(adminRole: AdminRole | null | undefined): string {
  switch (adminRole) {
    case 'super_admin':    return 'Super Admin'
    case 'producer_admin': return 'Producer Admin'
    case 'content_admin':  return 'Content Admin'
    case 'operations_admin': return 'Operations Admin'
    default: return 'Admin'
  }
}

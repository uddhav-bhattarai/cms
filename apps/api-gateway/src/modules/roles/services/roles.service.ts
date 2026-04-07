import { Injectable } from '@nestjs/common';

// Role hierarchy and permissions configuration
const ROLES_CONFIG: Record<string, { permissions: string[]; inherits?: string[] }> = {
  SUPER_ADMIN: {
    permissions: ['*:*:*'],
  },
  ADMIN: {
    permissions: [
      'users:read', 'users:create', 'users:update',
      'inventory:read', 'inventory:create', 'inventory:update', 'inventory:delete',
      'pos:read', 'pos:create', 'pos:update',
      'sales:read',
      'hr:read', 'hr:create', 'hr:update',
      'delivery:read', 'delivery:update',
    ],
  },
  CEO: {
    permissions: [
      'users:read',
      'inventory:read',
      'pos:read',
      'sales:read',
      'hr:read',
      'delivery:read',
      'analytics:read',
    ],
  },
  MANAGER_INVENTORY: {
    permissions: [
      'inventory:read', 'inventory:create', 'inventory:update',
      'inventory:approve_purchase', 'inventory:approve_transfer',
    ],
  },
  EMPLOYEE_INVENTORY: {
    permissions: ['inventory:read', 'inventory:create', 'inventory:update'],
  },
  MANAGER_POS: {
    permissions: [
      'pos:read', 'pos:create', 'pos:update', 'pos:delete',
      'pos:void_transaction', 'pos:refund',
    ],
  },
  EMPLOYEE_POS: {
    permissions: ['pos:read', 'pos:create'],
  },
  MANAGER_HR: {
    permissions: [
      'hr:read', 'hr:create', 'hr:update',
      'hr:manage_shifts', 'hr:view_salary',
    ],
  },
  EMPLOYEE_HR: {
    permissions: ['hr:read', 'hr:create', 'hr:update'],
  },
  MANAGER_DELIVERY: {
    permissions: [
      'delivery:read', 'delivery:create', 'delivery:update',
      'delivery:assign_driver', 'delivery:optimize_route',
    ],
  },
  EMPLOYEE_DELIVERY: {
    permissions: ['delivery:read', 'delivery:update_status'],
  },
};

@Injectable()
export class RolesService {
  getRolePermissions(role: string): string[] {
    const roleConfig = ROLES_CONFIG[role];
    if (!roleConfig) {
      return [];
    }
    return roleConfig.permissions;
  }

  getAllRoles(): string[] {
    return Object.keys(ROLES_CONFIG);
  }

  getRoleHierarchy(): Record<string, { permissions: string[] }> {
    return ROLES_CONFIG;
  }

  hasPermission(roles: string[], requiredPermission: string): boolean {
    for (const role of roles) {
      const permissions = this.getRolePermissions(role);
      if (permissions.includes('*:*:*') || permissions.includes(requiredPermission)) {
        return true;
      }
    }
    return false;
  }
}

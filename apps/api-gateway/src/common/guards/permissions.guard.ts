import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY, PERMISSIONS_KEY } from '../decorators';
import { JwtPayload } from '@bakery-erp/types';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no permissions required, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    // SUPER_ADMIN bypasses all permission checks
    if (user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    const userPermissions = user.permissions || [];

    // Check if user has at least one of the required permissions
    return requiredPermissions.some((requiredPermission) => {
      // Exact match
      if (userPermissions.includes(requiredPermission)) {
        return true;
      }

      const [resource, action] = requiredPermission.split(':');

      // Wildcard resource (e.g., "inventory:*")
      if (userPermissions.includes(`${resource}:*`)) {
        return true;
      }

      // Wildcard action (e.g., "*:read")
      if (userPermissions.includes(`*: ${action}`)) {
        return true;
      }

      return false;
    });
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'ADMIN', 'HR_MANAGER')
  getAllRoles() {
    return this.rolesService.getAllRoles();
  }

  @Get('hierarchy')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getRoleHierarchy() {
    return this.rolesService.getRoleHierarchy();
  }

  @Get('permissions/:role')
  @Roles('SUPER_ADMIN', 'ADMIN')
  getRolePermissions(@Param('role') role: string) {
    return {
      role,
      permissions: this.rolesService.getRolePermissions(role),
    };
  }
}

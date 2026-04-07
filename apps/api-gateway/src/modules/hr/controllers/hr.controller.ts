import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { HrService } from '../services/hr.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/roles.decorator';

@Controller('hr')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class HrController {
  constructor(private hrService: HrService) {}

  @Get('employees')
  @Permissions('hr:read')
  findAllEmployees() { return this.hrService.findAll(); }

  @Post('employees')
  @Permissions('hr:create')
  createEmployee(@Body() dto: any) { return this.hrService.create(dto); }
}

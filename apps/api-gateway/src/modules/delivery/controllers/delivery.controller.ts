import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { DeliveryService } from '../services/delivery.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/roles.decorator';

@Controller('delivery')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class DeliveryController {
  constructor(private deliveryService: DeliveryService) {}

  @Get()
  @Permissions('delivery:read')
  findAll() { return this.deliveryService.findAll(); }

  @Post()
  @Permissions('delivery:create')
  create(@Body() dto: any) { return this.deliveryService.create(dto); }

  @Put(':id')
  @Permissions('delivery:update')
  update(@Param('id') id: string, @Body() dto: any) { return this.deliveryService.update(id, dto); }
}

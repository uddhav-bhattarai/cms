import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PosService } from '../services/pos.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/roles.decorator';

@Controller('pos')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class PosController {
  constructor(private posService: PosService) {}

  @Get('orders')
  @Permissions('pos:read')
  findAllOrders() { return this.posService.findAll(); }

  @Get('orders/:id')
  @Permissions('pos:read')
  findOneOrder(@Param('id') id: string) { return this.posService.findOne(id); }

  @Post('orders')
  @Permissions('pos:create')
  createOrder(@Body() createOrderDto: any) { return this.posService.create(createOrderDto); }

  @Put('orders/:id')
  @Permissions('pos:update')
  updateOrder(@Param('id') id: string, @Body() updateOrderDto: any) {
    return this.posService.update(id, updateOrderDto);
  }
}

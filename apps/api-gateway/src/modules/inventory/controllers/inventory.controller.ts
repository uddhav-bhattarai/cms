import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { InventoryService } from '../services/inventory.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../common/guards/permissions.guard';
import { Permissions } from '../../../common/decorators/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  @Get()
  @Permissions('inventory:read')
  findAll() {
    return this.inventoryService.findAll();
  }

  @Get(':id')
  @Permissions('inventory:read')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(id);
  }

  @Post()
  @Permissions('inventory:create')
  create(@Body() createItemDto: any) {
    return this.inventoryService.create(createItemDto);
  }

  @Put(':id')
  @Permissions('inventory:update')
  update(@Param('id') id: string, @Body() updateItemDto: any) {
    return this.inventoryService.update(id, updateItemDto);
  }

  @Delete(':id')
  @Permissions('inventory:delete')
  remove(@Param('id') id: string) {
    return this.inventoryService.delete(id);
  }
}

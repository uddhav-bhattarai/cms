import { Injectable } from '@nestjs/common';

@Injectable()
export class InventoryService {
  private items: any[] = [];

  findAll() {
    return this.items;
  }

  findOne(id: string) {
    return this.items.find(item => item.id === id);
  }

  create(createItemDto: any) {
    const newItem = { id: String(this.items.length + 1), ...createItemDto, createdAt: new Date() };
    this.items.push(newItem);
    return newItem;
  }

  update(id: string, updateItemDto: any) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return null;
    this.items[index] = { ...this.items[index], ...updateItemDto };
    return this.items[index];
  }

  delete(id: string) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}

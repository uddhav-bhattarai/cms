import { Injectable } from '@nestjs/common';

@Injectable()
export class PosService {
  private orders: any[] = [];

  findAll() { return this.orders; }
  findOne(id: string) { return this.orders.find(o => o.id === id); }
  
  create(createOrderDto: any) {
    const newOrder = { 
      id: String(this.orders.length + 1), 
      ...createOrderDto, 
      status: 'pending',
      createdAt: new Date() 
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  update(id: string, updateOrderDto: any) {
    const index = this.orders.findIndex(o => o.id === id);
    if (index === -1) return null;
    this.orders[index] = { ...this.orders[index], ...updateOrderDto };
    return this.orders[index];
  }
}

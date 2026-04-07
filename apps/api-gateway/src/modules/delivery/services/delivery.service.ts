import { Injectable } from '@nestjs/common';
@Injectable()
export class DeliveryService {
  private deliveries: any[] = [];
  findAll() { return this.deliveries; }
  findOne(id: string) { return this.deliveries.find(d => d.id === id); }
  create(dto: any) {
    const newDel = { id: String(this.deliveries.length + 1), ...dto, status: 'pending', createdAt: new Date() };
    this.deliveries.push(newDel);
    return newDel;
  }
  update(id: string, dto: any) {
    const idx = this.deliveries.findIndex(d => d.id === id);
    if (idx === -1) return null;
    this.deliveries[idx] = { ...this.deliveries[idx], ...dto };
    return this.deliveries[idx];
  }
}

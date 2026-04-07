import { Injectable } from '@nestjs/common';
@Injectable()
export class HrService {
  private employees: any[] = [];
  findAll() { return this.employees; }
  findOne(id: string) { return this.employees.find(e => e.id === id); }
  create(dto: any) {
    const newEmp = { id: String(this.employees.length + 1), ...dto, createdAt: new Date() };
    this.employees.push(newEmp);
    return newEmp;
  }
}

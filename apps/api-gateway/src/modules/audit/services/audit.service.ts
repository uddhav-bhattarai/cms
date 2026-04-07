import { Injectable } from '@nestjs/common';
@Injectable()
export class AuditService {
  private logs: any[] = [];
  
  log(entry: any) {
    const logEntry = { id: String(this.logs.length + 1), ...entry, timestamp: new Date() };
    this.logs.push(logEntry);
    return logEntry;
  }
  
  findAll(filters?: any) {
    if (!filters) return this.logs;
    return this.logs.filter(log => 
      (!filters.userId || log.userId === filters.userId) &&
      (!filters.action || log.action === filters.action)
    );
  }
}
